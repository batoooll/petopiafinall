"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationStatus = exports.AppointmentsRepository = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const prisma_2 = require("../../../generated/prisma");
Object.defineProperty(exports, "VerificationStatus", { enumerable: true, get: function () { return prisma_2.VerificationStatus; } });
class AppointmentsRepository {
    static async findVetWithProfile(vetId) {
        return prisma_1.default.user.findUnique({
            where: { id: vetId },
            include: {
                vetProfile: {
                    include: { clinic: true },
                },
            },
        });
    }
    static async findPetForOwner(petId, ownerId) {
        return prisma_1.default.pet.findFirst({
            where: { id: petId, ownerId },
            include: { petOwnerProfile: true },
        });
    }
    static async findActiveAvailabilitySlot(vetId, startTime) {
        return prisma_1.default.vetAvailabilitySlot.findFirst({
            where: {
                vetId,
                isActive: true,
                startTime: { lte: startTime },
                endTime: { gt: startTime },
            },
        });
    }
    static async findExistingAppointment(vetId, startTime) {
        return prisma_1.default.appointment.findFirst({
            where: {
                vetId,
                startTime,
                status: { in: [prisma_2.AppointmentStatus.PENDING, prisma_2.AppointmentStatus.CONFIRMED] },
            },
        });
    }
    static async createAppointment(data) {
        return prisma_1.default.appointment.create({
            data: {
                ownerId: data.ownerId,
                vetId: data.vetId,
                petId: data.petId,
                startTime: data.startTime,
                price: data.price,
                ...(data.reason !== undefined ? { reason: data.reason } : {}),
                ...(data.clinicName !== undefined ? { clinicName: data.clinicName } : {}),
                ...(data.clinicAddress !== undefined ? { clinicAddress: data.clinicAddress } : {}),
                ...(data.petOwnerProfileId !== undefined ? { petOwnerProfileId: data.petOwnerProfileId } : {}),
            },
            include: {
                vet: { select: { id: true, fullName: true, email: true } },
                pet: true,
                owner: { select: { id: true, fullName: true, email: true } },
            },
        });
    }
}
exports.AppointmentsRepository = AppointmentsRepository;
//# sourceMappingURL=appointments.repository.js.map