import { Server } from 'socket.io';
/** Must match the room name used in socket.ts after JWT auth. */
export declare function userNotificationRoom(userId: string): string;
export declare class NotificationGateway {
    private static io;
    static initialize(io: Server): void;
    static emitToUser(userId: string, event: string, payload: unknown): void;
}
//# sourceMappingURL=notification.socket.d.ts.map