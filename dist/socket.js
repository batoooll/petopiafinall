"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = initSocket;
exports.getIO = getIO;
exports.createHttpServer = createHttpServer;
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const jwt_1 = require("./common/utils/jwt");
const chat_repository_1 = require("./modules/chat/chat.repository");
const notification_socket_1 = require("./modules/Notification/notification.socket");
const notification_helpers_1 = require("./modules/Notification/notification.helpers");
const notification_templates_1 = require("./modules/Notification/notification.templates");
console.log("=== socket.ts LOADED — new version with full logging ===");
let io;
// ── Safely unwrap payload from socket_io_client (Dart emits may be array-wrapped) ──
function extractPayload(raw) {
    if (raw == null)
        return {};
    if (Array.isArray(raw))
        return raw[0] ?? {};
    if (typeof raw === "object")
        return raw;
    return {};
}
function initSocket(httpServer) {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: (origin, callback) => {
                if (!origin || origin.startsWith("http://localhost")) {
                    return callback(null, true);
                }
                callback(new Error(`CORS: origin ${origin} not allowed`));
            },
            credentials: true,
        },
    });
    // ── Engine-level connection error (fires before auth middleware) ─────────
    io.engine.on("connection_error", (err) => {
        console.error(`[socket] ENGINE connection_error  code=${err.code}  msg="${err.message}"`);
    });
    // ── JWT auth middleware ───────────────────────────────────────────────────
    io.use((socket, next) => {
        console.log(`[socket] AUTH attempt  addr=${socket.handshake.address}  hasToken=${!!socket.handshake.auth["token"]}`);
        const token = socket.handshake.auth["token"];
        if (!token) {
            console.log(`[socket] AUTH rejected — no token`);
            return next(new Error("Unauthorized: no token provided"));
        }
        try {
            socket.data["user"] = (0, jwt_1.verifyToken)(token);
            console.log(`[socket] AUTH ok  userId=${socket.data["user"].userId}`);
            next();
        }
        catch (err) {
            console.error(`[socket] AUTH rejected — invalid token:`, err);
            next(new Error("Unauthorized: invalid or expired token"));
        }
    });
    notification_socket_1.NotificationGateway.initialize(io);
    // ── Connection handler ────────────────────────────────────────────────────
    io.on("connection", async (socket) => {
        const userId = socket.data["user"].userId;
        console.log(`[socket] ✅ CONNECTED  userId=${userId}  socketId=${socket.id}`);
        // User-specific room — guarantees delivery even for conversations created
        // after this socket connected (avoids the join_room timing gap).
        socket.join(`user:${userId}`);
        // Also join all existing conversation rooms for backward compat.
        try {
            const convs = await chat_repository_1.ChatRepository.getConversations(userId);
            for (const conv of convs) {
                socket.join(conv.id);
            }
            console.log(`[socket] auto-joined ${convs.length} existing room(s) for ${userId}`);
        }
        catch (err) {
            console.error(`[socket] auto-join failed for user ${userId}:`, err);
        }
        // ── join_room ─ client sends { conversationId } ───────────────────────
        socket.on("join_room", async (raw) => {
            try {
                const payload = extractPayload(raw);
                const conversationId = typeof payload["conversationId"] === "string"
                    ? payload["conversationId"]
                    : "";
                console.log(`[socket] join_room  userId=${userId}  conversationId=${conversationId || "(empty)"}`);
                if (!conversationId) {
                    socket.emit("error", { message: "conversationId is required" });
                    return;
                }
                const isMember = await chat_repository_1.ChatRepository.isParticipant(conversationId, userId);
                if (!isMember) {
                    console.log(`[socket] join_room REJECTED — not a participant`);
                    socket.emit("error", {
                        message: "You are not a participant of this conversation",
                    });
                    return;
                }
                socket.join(conversationId);
                socket.emit("joined", { conversationId });
                console.log(`[socket] join_room OK  conversationId=${conversationId}`);
            }
            catch (err) {
                console.error(`[socket] join_room error for user ${userId}:`, err);
                socket.emit("error", { message: "Failed to join room" });
            }
        });
        // ── send_message ─ client sends { conversationId, content } ──────────
        // Persists to DB BEFORE broadcasting so history is always consistent.
        socket.on("send_message", async (raw) => {
            console.log(`[socket] send_message RAW received from userId=${userId}:`, JSON.stringify(raw));
            try {
                const payload = extractPayload(raw);
                const conversationId = typeof payload["conversationId"] === "string"
                    ? payload["conversationId"]
                    : "";
                const content = typeof payload["content"] === "string" ? payload["content"] : "";
                console.log(`[socket] send_message  conversationId=${conversationId || "(empty)"}  content="${content || "(empty)"}"`);
                if (!conversationId || !content.trim()) {
                    console.log(`[socket] send_message REJECTED — missing fields`);
                    socket.emit("error", {
                        message: "conversationId and content are required",
                    });
                    return;
                }
                const isMember = await chat_repository_1.ChatRepository.isParticipant(conversationId, userId);
                console.log(`[socket] send_message isParticipant=${isMember}`);
                if (!isMember) {
                    socket.emit("error", {
                        message: "You are not a participant of this conversation",
                    });
                    return;
                }
                // ── Persist first, then broadcast ─────────────────────────────────
                console.log(`[socket] send_message calling saveMessage...`);
                const message = await chat_repository_1.ChatRepository.saveMessage({
                    conversationId,
                    senderId: userId,
                    content: content.trim(),
                });
                console.log(`[socket] send_message SAVED  messageId=${message.id}`);
                const msgPayload = {
                    id: message.id,
                    conversationId: message.conversationId,
                    senderId: message.senderId,
                    sender: message.sender,
                    content: message.content,
                    createdAt: message.createdAt,
                };
                // ACK to sender: message successfully persisted
                socket.emit("message_sent", msgPayload);
                // Broadcast to conversation room + every participant's user room.
                const participantIds = await chat_repository_1.ChatRepository.getParticipantIds(conversationId);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let emitter = io.to(conversationId);
                for (const pid of participantIds) {
                    emitter = emitter.to(`user:${pid}`);
                }
                emitter.emit("receive_message", msgPayload);
                console.log(`[socket] send_message broadcast to ${participantIds.length} participant(s)`);
                const senderName = message.sender?.fullName ?? "Someone";
                for (const pid of participantIds) {
                    if (pid !== userId) {
                        (0, notification_helpers_1.fireNotification)((0, notification_templates_1.notifyNewChatMessage)(pid, conversationId, senderName));
                    }
                }
            }
            catch (err) {
                console.error(`[socket] send_message ERROR for user ${userId}:`, err);
                socket.emit("error", { message: "Failed to send message" });
            }
        });
        socket.on("disconnect", () => {
            // intentionally left empty — socket.io cleans up room membership
        });
    });
    return io;
}
function getIO() {
    if (!io)
        throw new Error("Socket.io not initialized");
    return io;
}
// Attach socket.io to an Express app (call before app.listen in tests).
function createHttpServer(app) {
    return (0, http_1.createServer)(app);
}
//# sourceMappingURL=socket.js.map