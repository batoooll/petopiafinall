import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../common/middlewares/auth.middleware';
export declare class NotificationController {
    static getMyNotifications: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    static markAsRead: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    static markAllAsRead: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    static deleteNotification: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=notification.controller.d.ts.map