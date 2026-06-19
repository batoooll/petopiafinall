import type { CreateNotificationInput, NotificationListResult } from './notification.types';
export declare class NotificationService {
    static send(input: CreateNotificationInput): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        entityType: import("../../../generated/prisma").$Enums.NotificationEntityType | null;
        entityId: string | null;
        title: string;
        body: string;
        type: import("../../../generated/prisma").$Enums.NotificationType;
        isRead: boolean;
    }>;
    static getMyNotifications(userId: string, page?: number, limit?: number): Promise<NotificationListResult>;
    static markAsRead(userId: string, id: string): Promise<void>;
    static markAllAsRead(userId: string): Promise<void>;
    static deleteNotification(userId: string, id: string): Promise<void>;
}
//# sourceMappingURL=notification.service.d.ts.map