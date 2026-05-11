import type { Server, Socket } from "socket.io";
import { z } from "zod";
import { verifyToken } from "@/common/utils/jwt";
import { AppError } from "@/common/errors/AppError";
import { setChatIo } from "./chat.io";
import { ChatService } from "./chat.service";
import { SendMessageSchema } from "./chat.dto";

const JOIN_SCHEMA = z.object({
  conversationId: z.string().cuid(),
});

function extractBearer(header?: string): string | undefined {
  if (!header?.startsWith("Bearer ")) {
    return undefined;
  }
  return header.slice(7);
}

function emitSocketError(socket: Socket, err: unknown): void {
  if (err instanceof AppError) {
    socket.emit("chat:error", {
      message: err.message,
      code: err.statusCode,
    });
    return;
  }
  if (err instanceof z.ZodError) {
    socket.emit("chat:error", {
      message: err.issues.map((i) => i.message).join(", "),
      code: 400,
    });
    return;
  }
  socket.emit("chat:error", {
    message: "Unexpected error",
    code: 500,
  });
}

export function initChatSocketServer(io: Server): void {
  setChatIo(io);

  io.use((socket, next) => {
    try {
      const token =
        (socket.handshake.auth?.token as string | undefined) ||
        extractBearer(socket.handshake.headers.authorization);
      if (!token) {
        next(new Error("Unauthorized"));
        return;
      }
      socket.data.user = verifyToken(token);
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.user.userId;

    socket.on("chat:join", async (raw: unknown) => {
      try {
        const { conversationId } = JOIN_SCHEMA.parse(raw);
        await ChatService.assertConversationAccess(userId, conversationId);
        await socket.join(ChatService.roomFor(conversationId));
        socket.emit("chat:joined", { conversationId });
      } catch (err) {
        emitSocketError(socket, err);
      }
    });

    socket.on("chat:leave", async (raw: unknown) => {
      try {
        const { conversationId } = JOIN_SCHEMA.parse(raw);
        await socket.leave(ChatService.roomFor(conversationId));
        socket.emit("chat:left", { conversationId });
      } catch (err) {
        emitSocketError(socket, err);
      }
    });

    socket.on("chat:send_message", async (raw: unknown) => {
      try {
        const dto = SendMessageSchema.parse(raw);
        await ChatService.sendMessage(userId, dto);
      } catch (err) {
        emitSocketError(socket, err);
      }
    });
  });
}
