"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LostFoundService = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const AppError_1 = require("../../common/errors/AppError");
const VisionClient_1 = require("../../integrations/vision/VisionClient");
const lostFound_repository_1 = require("./lostFound.repository");
const prisma_2 = require("../../../generated/prisma");
const notification_helpers_1 = require("../Notification/notification.helpers");
const notification_templates_1 = require("../Notification/notification.templates");
class LostFoundService {
    // ── Lost ───────────────────────────────────────────────────────────────────
    static async reportLostPet(userId, input, imageBuffers, baseUrl) {
        // One active lost report per user
        const existing = await prisma_1.default.lostFoundReport.findFirst({
            where: { ownerId: userId, status: prisma_2.LostFoundStatus.LOST },
        });
        if (existing) {
            throw new AppError_1.AppError("You already have an active lost pet report. You cannot add another one.", AppError_1.HttpCode.BAD_REQUEST);
        }
        let name = input.name;
        let breed = input.breed;
        let gender = input.gender;
        // Autofill from existing pet when petId is provided
        if (input.petId) {
            const pet = await prisma_1.default.pet.findFirst({
                where: { id: input.petId, ownerId: userId },
            });
            if (!pet)
                throw new AppError_1.AppError("Pet not found or does not belong to you", AppError_1.HttpCode.NOT_FOUND);
            name = name ?? pet.name ?? undefined;
            breed = breed ?? pet.breed ?? undefined;
            gender = gender ?? pet.gender ?? undefined;
        }
        // AI breed + species detection from first image
        if (imageBuffers.length > 0 && !breed) {
            try {
                const img = imageBuffers[0];
                const ai = await VisionClient_1.VisionClient.analyzePetImage(img.buffer, img.filename);
                breed = breed ?? ai.breed;
            }
            catch {
                // AI failure is non-blocking
            }
        }
        const imageUrls = imageBuffers.map(({ filename }) => `${baseUrl}/uploads/lost-found/${filename}`);
        const report = await lostFound_repository_1.LostFoundRepository.createLostReport({
            ownerId: userId,
            species: input.species,
            description: input.description,
            lastSeenLocation: input.lastSeenLocation,
            lastSeenDate: new Date(input.lastSeenDate),
            ...(name !== undefined && { name }),
            ...(breed !== undefined && { breed }),
            ...(gender !== undefined && { gender }),
            ...(input.color !== undefined && { color: input.color }),
            imageUrls,
        });
        (0, notification_helpers_1.fireNotification)((0, notification_templates_1.notifyLostPetReported)(userId, report.id, name ?? undefined));
        if (input.petId) {
            try {
                await LostFoundService.cleanupAfterLostReport(userId, input.petId);
            }
            catch {
                // cleanup failure must not fail the report submission
            }
        }
        return report;
    }
    static async cleanupAfterLostReport(ownerId, petId) {
        // 1. Remove from pet matching — delete profile and cancel pending requests
        await prisma_1.default.petMatchProfile.deleteMany({ where: { petId } });
        await prisma_1.default.petMatchRequest.updateMany({
            where: {
                OR: [{ fromPetId: petId }, { toPetId: petId }],
                status: prisma_2.MatchRequestStatus.PENDING,
            },
            data: { status: prisma_2.MatchRequestStatus.CANCELLED },
        });
        // 2. Remove from sitting availability
        await prisma_1.default.pet.update({
            where: { id: petId },
            data: { isAvailableForSitting: false, payRatePerDay: null, sittingNotes: null },
        });
        // 3. Cancel active sitting bookings and notify each sitter
        const sittingBookings = await prisma_1.default.sittingBooking.findMany({
            where: {
                petId,
                status: { in: [prisma_2.SittingBookingStatus.PENDING, prisma_2.SittingBookingStatus.ACCEPTED] },
            },
            include: { pet: { select: { name: true } } },
        });
        if (sittingBookings.length > 0) {
            await prisma_1.default.sittingBooking.updateMany({
                where: {
                    petId,
                    status: { in: [prisma_2.SittingBookingStatus.PENDING, prisma_2.SittingBookingStatus.ACCEPTED] },
                },
                data: { status: prisma_2.SittingBookingStatus.CANCELLED },
            });
            for (const booking of sittingBookings) {
                const petName = booking.pet?.name ?? "the pet";
                const reason = `The sitting booking for ${petName} was cancelled because the pet was reported as lost.`;
                await LostFoundService.sendSystemMessage(ownerId, booking.sitterId, reason).catch(() => { });
                (0, notification_helpers_1.fireNotification)((0, notification_templates_1.notifySittingBookingCancelled)(booking.sitterId, booking.id, reason));
            }
        }
        // 4. Cancel pending/confirmed appointments and notify each vet
        const appointments = await prisma_1.default.appointment.findMany({
            where: {
                petId,
                status: { in: [prisma_2.AppointmentStatus.PENDING, prisma_2.AppointmentStatus.CONFIRMED] },
            },
            include: { pet: { select: { name: true } } },
        });
        if (appointments.length > 0) {
            await prisma_1.default.appointment.updateMany({
                where: {
                    petId,
                    status: { in: [prisma_2.AppointmentStatus.PENDING, prisma_2.AppointmentStatus.CONFIRMED] },
                },
                data: { status: prisma_2.AppointmentStatus.CANCELLED },
            });
            for (const appt of appointments) {
                const petName = appt.pet?.name ?? "the pet";
                const date = appt.startTime.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                });
                const reason = `The appointment for ${petName} on ${date} was cancelled because the pet was reported as lost.`;
                await LostFoundService.sendSystemMessage(ownerId, appt.vetId, reason).catch(() => { });
                (0, notification_helpers_1.fireNotification)((0, notification_templates_1.notifyAppointmentCancelled)(appt.vetId, appt.id, reason));
            }
        }
    }
    static async sendSystemMessage(fromUserId, toUserId, content) {
        let conversation = await prisma_1.default.conversation.findFirst({
            where: {
                AND: [
                    { participants: { some: { userId: fromUserId } } },
                    { participants: { some: { userId: toUserId } } },
                ],
            },
        });
        if (!conversation) {
            conversation = await prisma_1.default.conversation.create({
                data: {
                    type: prisma_2.ConversationType.MATCHING,
                    participants: {
                        create: [{ userId: fromUserId }, { userId: toUserId }],
                    },
                },
            });
        }
        await prisma_1.default.chatMessage.create({
            data: { conversationId: conversation.id, senderId: fromUserId, content },
        });
    }
    // ── Found ──────────────────────────────────────────────────────────────────
    static async reportFoundPet(userId, input, imageBuffers, baseUrl) {
        let breed = input.breed;
        // AI breed + species detection from first image
        if (imageBuffers.length > 0 && !breed) {
            try {
                const img = imageBuffers[0];
                const ai = await VisionClient_1.VisionClient.analyzePetImage(img.buffer, img.filename);
                breed = breed ?? ai.breed;
            }
            catch {
                // AI failure is non-blocking
            }
        }
        const imageUrls = imageBuffers.map(({ filename }) => `${baseUrl}/uploads/lost-found/${filename}`);
        const gender = input.gender;
        return lostFound_repository_1.LostFoundRepository.createFoundReport({
            finderId: userId,
            species: input.species,
            description: input.description,
            foundLocation: input.foundLocation,
            isPetStillAtLocation: input.isPetStillAtLocation,
            ...(breed !== undefined && { breed }),
            ...(gender !== undefined && { gender }),
            ...(input.color !== undefined && { color: input.color }),
            imageUrls,
        });
    }
    // ── Listings ───────────────────────────────────────────────────────────────
    static async getLostReports() {
        return lostFound_repository_1.LostFoundRepository.getLostReports();
    }
    static async getFoundReports() {
        return lostFound_repository_1.LostFoundRepository.getFoundReports();
    }
    static async deleteFoundReport(userId, reportId) {
        const result = await lostFound_repository_1.LostFoundRepository.deleteFoundReport(reportId, userId);
        if (result.count === 0) {
            throw new AppError_1.AppError("Report not found or you do not have permission to delete it.", AppError_1.HttpCode.NOT_FOUND);
        }
    }
}
exports.LostFoundService = LostFoundService;
//# sourceMappingURL=lostFound.service.js.map