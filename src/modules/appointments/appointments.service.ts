import { AppError, HttpCode } from "../../common/errors/AppError";
import { UserRole } from "../../../generated/prisma";
import { CreateAppointmentDto } from "./appointments.dto";
import { AppointmentsRepository, VerificationStatus } from "./appointments.repository";

export class AppointmentsService {
  private static timeToMinutes(time: string) {
    const [hour, minute] = time.split(":").map(Number) as [number, number];
    return hour * 60 + minute;
  }

  private static validateAppointmentWithinVetHours(
    appointmentStart: Date,
    profileStartTime: string,
    profileEndTime: string
  ) {
    const appointmentMinutes = appointmentStart.getUTCHours() * 60 + appointmentStart.getUTCMinutes();
    const startMinutes = this.timeToMinutes(profileStartTime);
    const endMinutes = this.timeToMinutes(profileEndTime);

    if (appointmentMinutes < startMinutes || appointmentMinutes >= endMinutes) {
      throw new AppError("Appointment time must be within vet working hours", HttpCode.BAD_REQUEST);
    }
  }

  static async createAppointment(ownerId: string, dto: CreateAppointmentDto) {
    if (!dto.vetId || !dto.petId || !dto.startTime) {
      throw new AppError("vetId, petId, and startTime are required", HttpCode.BAD_REQUEST);
    }

    const requestedTime = new Date(dto.startTime);
    if (isNaN(requestedTime.getTime())) {
      throw new AppError("Invalid startTime", HttpCode.BAD_REQUEST);
    }

    const vet = await AppointmentsRepository.findVetWithProfile(dto.vetId);
    if (!vet || vet.role !== UserRole.VET || !vet.vetProfile) {
      throw new AppError("Vet not found", HttpCode.NOT_FOUND);
    }

    if (vet.vetProfile.verificationStatus !== VerificationStatus.VERIFIED) {
      throw new AppError("Only verified vets can receive appointments", HttpCode.FORBIDDEN);
    }

    this.validateAppointmentWithinVetHours(
      requestedTime,
      vet.vetProfile.startTime,
      vet.vetProfile.endTime
    );

    const pet = await AppointmentsRepository.findPetForOwner(dto.petId, ownerId);
    if (!pet) {
      throw new AppError("Pet not found for this owner", HttpCode.NOT_FOUND);
    }

    const availabilitySlot = await AppointmentsRepository.findActiveAvailabilitySlot(dto.vetId, requestedTime);
    if (!availabilitySlot) {
      throw new AppError("No active availability slot for this time", HttpCode.BAD_REQUEST);
    }

    const existingAppointment = await AppointmentsRepository.findExistingAppointment(dto.vetId, requestedTime);
    if (existingAppointment) {
      throw new AppError("This appointment time is already booked", HttpCode.BAD_REQUEST);
    }

    return AppointmentsRepository.createAppointment({
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
