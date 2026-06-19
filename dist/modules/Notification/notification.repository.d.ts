import { Prisma } from '../../../generated/prisma';
export declare class NotificationRepository {
    static create(data: Prisma.NotificationUncheckedCreateInput): Prisma.Prisma__NotificationClient<{
        id: string;
        createdAt: Date;
        userId: string;
        entityType: import("../../../generated/prisma").$Enums.NotificationEntityType | null;
        entityId: string | null;
        title: string;
        body: string;
        type: import("../../../generated/prisma").$Enums.NotificationType;
        isRead: boolean;
    }, never, import("../../../generated/prisma/runtime/client").DefaultArgs, {
        log: ("warn" | "error")[];
        adapter: import("@prisma/adapter-pg").PrismaPg;
    }>;
    static findByUser(userId: string, page?: number, limit?: number): Promise<{
        items: {
            id: string;
            createdAt: Date;
            userId: string;
            entityType: import("../../../generated/prisma").$Enums.NotificationEntityType | null;
            entityId: string | null;
            title: string;
            body: string;
            type: import("../../../generated/prisma").$Enums.NotificationType;
            isRead: boolean;
        }[];
        total: number;
    }>;
    static countUnread(userId: string): Prisma.PrismaPromise<number>;
    static markAsRead(id: string, userId: string): Prisma.PrismaPromise<Prisma.BatchPayload>;
    static markAllAsRead(userId: string): Prisma.PrismaPromise<Prisma.BatchPayload>;
    static delete(id: string, userId: string): Prisma.PrismaPromise<Prisma.BatchPayload>;
}
//# sourceMappingURL=notification.repository.d.ts.map