"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../common/middlewares/auth.middleware");
const notification_controller_1 = require("./notification.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect);
router.get('/', notification_controller_1.NotificationController.getMyNotifications);
// Must be registered before /:id/read so "read-all" is not captured as an id
router.patch('/read-all', notification_controller_1.NotificationController.markAllAsRead);
router.patch('/:id/read', notification_controller_1.NotificationController.markAsRead);
router.delete('/:id', notification_controller_1.NotificationController.deleteNotification);
exports.default = router;
//# sourceMappingURL=notification.routes.js.map