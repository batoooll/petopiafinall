import { BookAppointmentDto } from "./appointments.dto";
import { AppointmentsRepository } from "./appointments.repository";
export declare class AppointmentsService {
    private readonly repo;
    constructor(repo: AppointmentsRepository);
    listDoctors(): Promise<{
        id: string;
        email: string;
        fullName: string;
        availabilitySlots: {
            id: string;
            startTime: Date;
            endTime: Date;
        }[];
        vetProfile: {
            id: string;
            phone: string;
            verificationStatus: import("../../../generated/prisma").$Enums.VerificationStatus;
            clinic: {
                id: string;
                name: string;
                phone: string;
                address: string;
            };
            description: string | null;
            yearsOfExperience: number;
            appointmentPrice: number;
            startTime: string;
            endTime: string;
            photo: string | null;
            specialization: string | null;
        } | null;
    }[]>;
    bookAppointment(ownerId: string, dto: BookAppointmentDto, invoiceFile: Express.Multer.File | undefined): Promise<{
        appointment: {
            pet: {
                id: string;
                name: string;
                breed: string | null;
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
        };
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            appointmentId: string | null;
            payerId: string;
            method: import("../../../generated/prisma").$Enums.PaymentMethod;
            status: import("../../../generated/prisma").$Enums.PaymentStatus;
            amount: number;
            currency: string;
            proofAssetId: string | null;
            petOwnerProfileId: string | null;
        };
        asset: {
            id: string;
            createdAt: Date;
            url: string;
            mimeType: string | null;
            sizeBytes: number | null;
            storageKey: string | null;
            uploadedById: string | null;
        };
    }>;
    private validateWithinWorkingHours;
}
export declare const appointmentsService: AppointmentsService;
//# sourceMappingURL=appointments.service.d.ts.map