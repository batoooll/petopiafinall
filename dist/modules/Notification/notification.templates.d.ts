export declare function notifyVetApproved(userId: string, vetProfileId: string): Promise<{
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
export declare function notifyVetRejected(userId: string, vetProfileId: string): Promise<{
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
export declare function notifyPaymentApproved(ownerId: string, paymentId: string, appointmentId: string): Promise<{
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
export declare function notifyPaymentRejected(ownerId: string, paymentId: string, appointmentId: string): Promise<{
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
export declare function notifyAppointmentConfirmedForVet(vetUserId: string, appointmentId: string, petName?: string): Promise<{
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
export declare function notifyAppointmentBookedPending(ownerId: string, appointmentId: string): Promise<{
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
export declare function notifyAppointmentCancelled(userId: string, appointmentId: string, reason?: string): Promise<{
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
export declare function notifySitterApproved(userId: string, sitterProfileId: string): Promise<{
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
export declare function notifySitterRejected(userId: string, sitterProfileId: string): Promise<{
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
export declare function notifySittingBookingRequested(sitterUserId: string, bookingId: string, petName?: string): Promise<{
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
export declare function notifySittingBookingAccepted(ownerUserId: string, bookingId: string): Promise<{
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
export declare function notifySittingBookingCancelled(userId: string, bookingId: string, reason?: string): Promise<{
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
export declare function notifySittingBookingRejected(ownerUserId: string, bookingId: string): Promise<{
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
export declare function notifyMatchRequestReceived(targetOwnerId: string, requestId: string, fromPetName?: string): Promise<{
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
export declare function notifyMatchAccepted(requesterOwnerId: string, requestId: string, toPetName?: string): Promise<{
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
export declare function notifyNewChatMessage(recipientUserId: string, conversationId: string, senderName: string): Promise<{
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
export declare function notifyLostPetReported(ownerId: string, reportId: string, petName?: string): Promise<{
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
export declare function notifySystem(userId: string, title: string, body: string): Promise<{
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
//# sourceMappingURL=notification.templates.d.ts.map