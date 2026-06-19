"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyVetApproved = notifyVetApproved;
exports.notifyVetRejected = notifyVetRejected;
exports.notifyPaymentApproved = notifyPaymentApproved;
exports.notifyPaymentRejected = notifyPaymentRejected;
exports.notifyAppointmentConfirmedForVet = notifyAppointmentConfirmedForVet;
exports.notifyAppointmentBookedPending = notifyAppointmentBookedPending;
exports.notifyAppointmentCancelled = notifyAppointmentCancelled;
exports.notifySitterApproved = notifySitterApproved;
exports.notifySitterRejected = notifySitterRejected;
exports.notifySittingBookingRequested = notifySittingBookingRequested;
exports.notifySittingBookingAccepted = notifySittingBookingAccepted;
exports.notifySittingBookingCancelled = notifySittingBookingCancelled;
exports.notifySittingBookingRejected = notifySittingBookingRejected;
exports.notifyMatchRequestReceived = notifyMatchRequestReceived;
exports.notifyMatchAccepted = notifyMatchAccepted;
exports.notifyNewChatMessage = notifyNewChatMessage;
exports.notifyLostPetReported = notifyLostPetReported;
exports.notifySystem = notifySystem;
const prisma_1 = require("../../../generated/prisma");
const notification_service_1 = require("./notification.service");
async function dispatch(params) {
    return notification_service_1.NotificationService.send(params);
}
// ── Vet verification (admin approves / rejects certificates) ─────────────────
async function notifyVetApproved(userId, vetProfileId) {
    return dispatch({
        userId,
        title: 'Certificate approved',
        body: 'Your vet account is verified. You can now set your clinic and availability.',
        type: prisma_1.NotificationType.VET_VERIFICATION,
        entityId: vetProfileId,
        entityType: prisma_1.NotificationEntityType.VET_PROFILE,
    });
}
async function notifyVetRejected(userId, vetProfileId) {
    return dispatch({
        userId,
        title: 'Certificate rejected',
        body: 'Your registration was not approved. Contact support if you believe this is a mistake.',
        type: prisma_1.NotificationType.VET_VERIFICATION,
        entityId: vetProfileId,
        entityType: prisma_1.NotificationEntityType.VET_PROFILE,
    });
}
// ── Appointment payments (InstaPay invoice verified by admin) ────────────────
async function notifyPaymentApproved(ownerId, paymentId, appointmentId) {
    return dispatch({
        userId: ownerId,
        title: 'Payment confirmed',
        body: 'Your appointment payment was verified. Your reservation is confirmed.',
        type: prisma_1.NotificationType.PAYMENT,
        entityId: paymentId,
        entityType: prisma_1.NotificationEntityType.PAYMENT,
    });
}
async function notifyPaymentRejected(ownerId, paymentId, appointmentId) {
    return dispatch({
        userId: ownerId,
        title: 'Payment rejected',
        body: 'Your payment could not be verified. The appointment was cancelled.',
        type: prisma_1.NotificationType.PAYMENT,
        entityId: paymentId,
        entityType: prisma_1.NotificationEntityType.PAYMENT,
    });
}
async function notifyAppointmentConfirmedForVet(vetUserId, appointmentId, petName) {
    const petLabel = petName ? ` for ${petName}` : '';
    return dispatch({
        userId: vetUserId,
        title: 'New confirmed appointment',
        body: `A pet owner booked an appointment${petLabel}. Check your schedule.`,
        type: prisma_1.NotificationType.APPOINTMENT,
        entityId: appointmentId,
        entityType: prisma_1.NotificationEntityType.APPOINTMENT,
    });
}
async function notifyAppointmentBookedPending(ownerId, appointmentId) {
    return dispatch({
        userId: ownerId,
        title: 'Appointment submitted',
        body: 'Your booking is pending payment verification by an admin.',
        type: prisma_1.NotificationType.APPOINTMENT,
        entityId: appointmentId,
        entityType: prisma_1.NotificationEntityType.APPOINTMENT,
    });
}
async function notifyAppointmentCancelled(userId, appointmentId, reason) {
    return dispatch({
        userId,
        title: 'Appointment cancelled',
        body: reason ?? 'An appointment was cancelled.',
        type: prisma_1.NotificationType.APPOINTMENT,
        entityId: appointmentId,
        entityType: prisma_1.NotificationEntityType.APPOINTMENT,
    });
}
// ── Pet sitting (admin approves sitter place + ID) ───────────────────────────
async function notifySitterApproved(userId, sitterProfileId) {
    return dispatch({
        userId,
        title: 'Pet sitter approved',
        body: 'Your sitter profile was approved. Owners can now book you.',
        type: prisma_1.NotificationType.PET_SITTING,
        entityId: sitterProfileId,
    });
}
async function notifySitterRejected(userId, sitterProfileId) {
    return dispatch({
        userId,
        title: 'Pet sitter rejected',
        body: 'Your sitter application was not approved. Update your photos and try again.',
        type: prisma_1.NotificationType.PET_SITTING,
        entityId: sitterProfileId,
    });
}
async function notifySittingBookingRequested(sitterUserId, bookingId, petName) {
    const petLabel = petName ?? 'a pet';
    return dispatch({
        userId: sitterUserId,
        title: 'New sitting request',
        body: `You received a sitting request for ${petLabel}.`,
        type: prisma_1.NotificationType.PET_SITTING,
        entityId: bookingId,
        entityType: prisma_1.NotificationEntityType.SITTING_BOOKING,
    });
}
async function notifySittingBookingAccepted(ownerUserId, bookingId) {
    return dispatch({
        userId: ownerUserId,
        title: 'Sitting request accepted',
        body: 'Your pet sitter accepted the booking.',
        type: prisma_1.NotificationType.PET_SITTING,
        entityId: bookingId,
        entityType: prisma_1.NotificationEntityType.SITTING_BOOKING,
    });
}
async function notifySittingBookingCancelled(userId, bookingId, reason) {
    return dispatch({
        userId,
        title: 'Sitting booking cancelled',
        body: reason ?? 'A sitting booking was cancelled.',
        type: prisma_1.NotificationType.PET_SITTING,
        entityId: bookingId,
        entityType: prisma_1.NotificationEntityType.SITTING_BOOKING,
    });
}
async function notifySittingBookingRejected(ownerUserId, bookingId) {
    return dispatch({
        userId: ownerUserId,
        title: 'Sitting request declined',
        body: 'The sitter declined your booking request.',
        type: prisma_1.NotificationType.PET_SITTING,
        entityId: bookingId,
        entityType: prisma_1.NotificationEntityType.SITTING_BOOKING,
    });
}
// ── Pet matching ─────────────────────────────────────────────────────────────
async function notifyMatchRequestReceived(targetOwnerId, requestId, fromPetName) {
    const petLabel = fromPetName ? `${fromPetName}` : 'another pet';
    return dispatch({
        userId: targetOwnerId,
        title: 'New match request',
        body: `${petLabel} wants to match with your pet.`,
        type: prisma_1.NotificationType.PET_MATCH,
        entityId: requestId,
        entityType: prisma_1.NotificationEntityType.MATCH_REQUEST,
    });
}
async function notifyMatchAccepted(requesterOwnerId, requestId, toPetName) {
    const petLabel = toPetName ? `${toPetName}'s owner` : 'A pet owner';
    return dispatch({
        userId: requesterOwnerId,
        title: 'Match accepted',
        body: `${petLabel} accepted your match request. You can chat now.`,
        type: prisma_1.NotificationType.PET_MATCH,
        entityId: requestId,
        entityType: prisma_1.NotificationEntityType.MATCH_REQUEST,
    });
}
// ── Chat ─────────────────────────────────────────────────────────────────────
async function notifyNewChatMessage(recipientUserId, conversationId, senderName) {
    return dispatch({
        userId: recipientUserId,
        title: 'New message',
        body: `${senderName} sent you a message.`,
        type: prisma_1.NotificationType.CHAT,
        entityId: conversationId,
        entityType: prisma_1.NotificationEntityType.CONVERSATION,
    });
}
// ── Lost & found ─────────────────────────────────────────────────────────────
async function notifyLostPetReported(ownerId, reportId, petName) {
    const petLabel = petName ?? 'Your pet';
    return dispatch({
        userId: ownerId,
        title: 'Lost pet report submitted',
        body: `${petLabel} was reported as lost. Related bookings were cancelled.`,
        type: prisma_1.NotificationType.LOST_FOUND,
        entityId: reportId,
        entityType: prisma_1.NotificationEntityType.LOST_FOUND_REPORT,
    });
}
// ── Generic system messages ──────────────────────────────────────────────────
async function notifySystem(userId, title, body) {
    return dispatch({
        userId,
        title,
        body,
        type: prisma_1.NotificationType.SYSTEM,
    });
}
//# sourceMappingURL=notification.templates.js.map