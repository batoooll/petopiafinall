import prisma from "../../config/prisma";
import { AppointmentStatus, VerificationStatus } from "../../../generated/prisma";

export class AppointmentsRepository {
  static async findVetWithProfile(vetId: string) {
    return prisma.user.findUnique({
      where: { id: vetId },
      include: {
        vetProfile: {
          include: { clinic: true },
        },
      },
    });
  }

  static async findPetForOwner(petId: string, ownerId: string) {
    return prisma.pet.findFirst({
      where: { id: petId, ownerId },
      include: { petOwnerProfile: true },
    });
  }

  static async findActiveAvailabilitySlot(vetId: string, startTime: Date) {
    return prisma.vetAvailabilitySlot.findFirst({
      where: {
        vetId,
        isActive: true,
        startTime: { lte: startTime },
        endTime: { gt: startTime },
      },
    });
  }

  static async findExistingAppointment(vetId: string, startTime: Date) {
    return prisma.appointment.findFirst({
      where: {
        vetId,
        startTime,
        status: { in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
      },
    });
  }

  static async createAppointment(data: {
    ownerId: string;
    vetId: string;
    petId: string;
    startTime: Date;
    reason?: string | undefined;
    price: number;
    clinicName?: string | undefined;
    clinicAddress?: string | undefined;
    petOwnerProfileId?: string | undefined;
  }) {
    return prisma.appointment.create({
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

export { VerificationStatus };
