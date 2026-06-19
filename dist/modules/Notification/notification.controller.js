"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const AppError_1 = require("../../common/errors/AppError");
const notification_service_1 = require("./notification.service");
const notification_dto_1 = require("./notification.dto");
class NotificationController {
    static getMyNotifications = async (req, res, next) => {
        try {
            if (!req.user?.userId) {
                throw new AppError_1.AppError('Unauthorized', AppError_1.HttpCode.UNAUTHORIZED);
            }
            const parsed = notification_dto_1.GetNotificationsSchema.safeParse(req.query);
            if (!parsed.success) {
                res.status(AppError_1.HttpCode.BAD_REQUEST).json({
                    success: false,
                    message: 'Validation failed',
                    error: parsed.error.flatten().fieldErrors,
                });
                return;
            }
            const data = await notification_service_1.NotificationService.getMyNotifications(req.user.userId, parsed.data.page, parsed.data.limit);
            res.json({
                success: true,
                message: 'Notifications retrieved successfully',
                data: data.notifications,
                meta: {
                    unreadCount: data.unreadCount,
                    ...data.meta,
                },
            });
        }
        catch (err) {
            next(err);
        }
    };
    static markAsRead = async (req, res, next) => {
        try {
            if (!req.user?.userId) {
                throw new AppError_1.AppError('Unauthorized', AppError_1.HttpCode.UNAUTHORIZED);
            }
            const parsed = notification_dto_1.NotificationIdSchema.safeParse(req.params);
            if (!parsed.success) {
                res.status(AppError_1.HttpCode.BAD_REQUEST).json({
                    success: false,
                    message: 'Validation failed',
                    error: parsed.error.flatten().fieldErrors,
                });
                return;
            }
            await notification_service_1.NotificationService.markAsRead(req.user.userId, parsed.data.id);
            res.json({
                success: true,
                message: 'Notification marked as read',
            });
        }
        catch (err) {
            next(err);
        }
    };
    static markAllAsRead = async (req, res, next) => {
        try {
            if (!req.user?.userId) {
                throw new AppError_1.AppError('Unauthorized', AppError_1.HttpCode.UNAUTHORIZED);
            }
            await notification_service_1.NotificationService.markAllAsRead(req.user.userId);
            res.json({
                success: true,
                message: 'All notifications marked as read',
            });
        }
        catch (err) {
            next(err);
        }
    };
    static deleteNotification = async (req, res, next) => {
        try {
            if (!req.user?.userId) {
                throw new AppError_1.AppError('Unauthorized', AppError_1.HttpCode.UNAUTHORIZED);
            }
            const parsed = notification_dto_1.NotificationIdSchema.safeParse(req.params);
            if (!parsed.success) {
                res.status(AppError_1.HttpCode.BAD_REQUEST).json({
                    success: false,
                    message: 'Validation failed',
                    error: parsed.error.flatten().fieldErrors,
                });
                return;
            }
            await notification_service_1.NotificationService.deleteNotification(req.user.userId, parsed.data.id);
            res.json({
                success: true,
                message: 'Notification deleted',
            });
        }
        catch (err) {
            next(err);
        }
    };
}
exports.NotificationController = NotificationController;
//# sourceMappingURL=notification.controller.js.map