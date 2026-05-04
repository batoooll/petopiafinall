"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsService = void 0;
const AppError_1 = require("../../common/errors/AppError");
const prisma_1 = require("../../../generated/prisma");
const appointments_repository_1 = require("./appointments.repository");
class AppointmentsService {
    static timeToMinutes(time) {
        const [hour, minute] = time.split(":").map(Number);
        return hour * 60 + minute;
    }
    static validateAppointmentWithinVetHours(appointmentStart, profileStartTime, profileEndTime) {
        const appointmentMinutes = appointmentStart.getUTCHours() * 60 + appointmentStart.getUTCMinutes();
        const startMinutes = this.timeToMinutes(profileStartTime);
        const endMinutes = this.timeToMinutes(profileEndTime);
        if (appointmentMinutes < startMinutes || appointmentMinutes >= endMinutes) {
            throw new AppError_1.AppError("Appointment time must be within vet working hours", AppError_1.HttpCode.BAD_REQUEST);
        }
    }
    static async createAppointment(ownerId, dto) {
        if (!dto.vetId || !dto.petId || !dto.startTime) {
            throw new AppError_1.AppError("vetId, petId, and startTime are required", AppError_1.HttpCode.BAD_REQUEST);
        }
        const requestedTime = new Date(dto.startTime);
        if (isNaN(requestedTime.getTime())) {
            throw new AppError_1.AppError("Invalid startTime", AppError_1.HttpCode.BAD_REQUEST);
        }
        const vet = await appointments_repository_1.AppointmentsRepository.findVetWithProfile(dto.vetId);
        if (!vet || vet.role !== prisma_1.UserRole.VET || !vet.vetProfile) {
            throw new AppError_1.AppError("Vet not found", AppError_1.HttpCode.NOT_FOUND);
        }
        if (vet.vetProfile.verificationStatus !== appointments_repository_1.VerificationStatus.VERIFIED) {
            throw new AppError_1.AppError("Only verified vets can receive appointments", AppError_1.HttpCode.FORBIDDEN);
        }
        this.validateAppointmentWithinVetHours(requestedTime, vet.vetProfile.startTime, vet.vetProfile.endTime);
        const pet = await appointments_repository_1.AppointmentsRepository.findPetForOwner(dto.petId, ownerId);
        if (!pet) {
            throw new AppError_1.AppError("Pet not found for this owner", AppError_1.HttpCode.NOT_FOUND);
        }
        const availabilitySlot = await appointments_repository_1.AppointmentsRepository.findActiveAvailabilitySlot(dto.vetId, requestedTime);
        if (!availabilitySlot) {
            throw new AppError_1.AppError("No active availability slot for this time", AppError_1.HttpCode.BAD_REQUEST);
        }
        const existingAppointment = await appointments_repository_1.AppointmentsRepository.findExistingAppointment(dto.vetId, requestedTime);
        if (existingAppointment) {
            throw new AppError_1.AppError("This appointment time is already booked", AppError_1.HttpCode.BAD_REQUEST);
        }
        return appointments_repository_1.AppointmentsRepository.createAppointment({
            ownerId,
            vetId: dto.vetId,
            petId: dto.petId,
            startTime: requestedTime,
            price: vet.vetProfile.appointmentPrice,
            clinicName: vet.vetProfile.clinic.name,
            clinicAddress: vet.vetProfile.clinic.address,
            ...(dto.reason !== undefined ? { reason: dto.reason } : {}),
            ...(pet.petOwnerProfileId !== null ? { petOwnerProfileId: pet.petOwnerProfileId } : {}),
        });
    }
}
exports.AppointmentsService = AppointmentsService;
//# sourceMappingURL=appointments.service.js.map