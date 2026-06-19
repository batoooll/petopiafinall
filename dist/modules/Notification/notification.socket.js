"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationGateway = void 0;
exports.userNotificationRoom = userNotificationRoom;
/** Must match the room name used in socket.ts after JWT auth. */
function userNotificationRoom(userId) {
    return `user:${userId}`;
}
class NotificationGateway {
    static io = null;
    static initialize(io) {
        this.io = io;
    }
    static emitToUser(userId, event, payload) {
        if (!this.io) {
            return;
        }
        this.io.to(userNotificationRoom(userId)).emit(event, payload);
    }
}
exports.NotificationGateway = NotificationGateway;
//# sourceMappingURL=notification.socket.js.map