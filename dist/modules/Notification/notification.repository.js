"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
class NotificationRepository {
    static create(data) {
        return prisma_1.default.notification.create({ data });
    }
    static async findByUser(userId, page = 1, limit = 20) {
        const where = { userId };
        const [items, total] = await Promise.all([
            prisma_1.default.notification.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma_1.default.notification.count({ where }),
        ]);
        return { items, total };
    }
    static countUnread(userId) {
        return prisma_1.default.notification.count({
            where: {
                userId,
                isRead: false,
            },
        });
    }
    static markAsRead(id, userId) {
        return prisma_1.default.notification.updateMany({
            where: { id, userId },
            data: { isRead: true },
        });
    }
    static markAllAsRead(userId) {
        return prisma_1.default.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
    }
    static delete(id, userId) {
        return prisma_1.default.notification.deleteMany({
            where: { id, userId },
        });
    }
}
exports.NotificationRepository = NotificationRepository;
//# sourceMappingURL=notification.repository.js.map