"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const notification_repository_1 = require("./notification.repository");
const notification_socket_1 = require("./notification.socket");
const AppError_1 = require("../../common/errors/AppError");
class NotificationService {
    static async send(input) {
        const notification = await notification_repository_1.NotificationRepository.create({
            userId: input.userId,
            title: input.title,
            body: input.body,
            type: input.type,
            entityId: input.entityId ?? null,
            entityType: input.entityType ?? null,
        });
        notification_socket_1.NotificationGateway.emitToUser(input.userId, 'notification:new', notification);
        return notification;
    }
    static async getMyNotifications(userId, page = 1, limit = 20) {
        const [{ items, total }, unreadCount] = await Promise.all([
            notification_repository_1.NotificationRepository.findByUser(userId, page, limit),
            notification_repository_1.NotificationRepository.countUnread(userId),
        ]);
        return {
            notifications: items,
            unreadCount,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit) || 0,
            },
        };
    }
    static async markAsRead(userId, id) {
        const result = await notification_repository_1.NotificationRepository.markAsRead(id, userId);
        if (result.count === 0) {
            throw new AppError_1.AppError('Notification not found', AppError_1.HttpCode.NOT_FOUND);
        }
    }
    static async markAllAsRead(userId) {
        await notification_repository_1.NotificationRepository.markAllAsRead(userId);
    }
    static async deleteNotification(userId, id) {
        const result = await notification_repository_1.NotificationRepository.delete(id, userId);
        if (result.count === 0) {
            throw new AppError_1.AppError('Notification not found', AppError_1.HttpCode.NOT_FOUND);
        }
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map