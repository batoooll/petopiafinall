import { VerificationStatus } from "../../../generated/prisma";
export declare class AppointmentsRepository {
    static findVetWithProfile(vetId: string): Promise<({
        vetProfile: ({
            clinic: {
                id: string;
                createdAt: Date;
                name: string;
                phone: string;
                address: string;
                updatedAt: Date;
            };
        } & {
            id: string;
            phone: string;
            userId: string;
            description: string | null;
            yearsOfExperience: number;
            appointmentPrice: number;
            startTime: string;
            endTime: string;
            certificateImage: string;
            photo: string | null;
            firstName: string | null;
            surname: string | null;
            specialization: string | null;
            verificationStatus: import("../../../generated/prisma").$Enums.VerificationStatus;
            clinicId: string;
        }) | null;
    } & {
        id: string;
        email: string;
        passwordHash: string;
        fullName: string;
        age: number;
        role: import("../../../generated/prisma").$Enums.UserRole;
        createdAt: Date;
        gender: import("../../../generated/prisma").$Enums.Gender;
    }) | null>;
    static findPetForOwner(petId: string, ownerId: string): Promise<({
        petOwnerProfile: {
            id: string;
            phone: string;
            address: string | null;
            userId: string;
        } | null;
    } & {
        id: string;
        petOwnerProfileId: string | null;
        ownerId: string;
    }) | null>;
    static findActiveAvailabilitySlot(vetId: string, startTime: Date): Promise<{
        id: string;
        startTime: Date;
        endTime: Date;
        clinicId: string | null;
        vetId: string;
        isActive: boolean;
    } | null>;
    static findExistingAppointment(vetId: string, startTime: Date): Promise<{
        id: string;
        createdAt: Date;
        startTime: Date;
        status: import("../../../generated/prisma").$Enums.AppointmentStatus;
        petOwnerProfileId: string | null;
        ownerId: string;
        vetId: string;
        petId: string;
        clinicName: string | null;
        clinicAddress: string | null;
        reason: string | null;
        price: number;
    } | null>;
    static createAppointment(data: {
        ownerId: string;
        vetId: string;
        petId: string;
        startTime: Date;
        reason?: string | undefined;
        price: number;
        clinicName?: string | undefined;
        clinicAddress?: string | undefined;
        petOwnerProfileId?: string | undefined;
    }): Promise<{
        pet: {
            id: string;
            petOwnerProfileId: string | null;
            ownerId: string;
        };
        owner: {
            id: string;
            email: string;
            fullName: string;
        };
        vet: {
            id: string;
            email: string;
            fullName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        startTime: Date;
        status: import("../../../generated/prisma").$Enums.AppointmentStatus;
        petOwnerProfileId: string | null;
        ownerId: string;
        vetId: string;
        petId: string;
        clinicName: string | null;
        clinicAddress: string | null;
        reason: string | null;
        price: number;
    }>;
}
export { VerificationStatus };
//# sourceMappingURL=appointments.repository.d.ts.map