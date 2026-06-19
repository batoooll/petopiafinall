import { z } from 'zod';
export declare const GetNotificationsSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type GetNotificationsInput = z.infer<typeof GetNotificationsSchema>;
export declare const NotificationIdSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type NotificationIdInput = z.infer<typeof NotificationIdSchema>;
//# sourceMappingURL=notification.dto.d.ts.map