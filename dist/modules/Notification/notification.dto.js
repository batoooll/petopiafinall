"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationIdSchema = exports.GetNotificationsSchema = void 0;
const zod_1 = require("zod");
exports.GetNotificationsSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(50).default(20),
});
exports.NotificationIdSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
//# sourceMappingURL=notification.dto.js.map