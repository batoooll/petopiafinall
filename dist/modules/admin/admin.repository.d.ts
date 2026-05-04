import { PrismaClient, Prisma, VerificationStatus } from "../../../generated/prisma";
export declare class AdminRepository {
    private readonly db;
    constructor(db: PrismaClient);
    findAdminByEmail(email: string): Promise<{
        id: string;
        email: string;
        passwordHash: string;
        fullName: string;
        age: number;
        role: import("../../../generated/prisma").$Enums.UserRole;
        createdAt: Date;
        gender: import("../../../generated/prisma").$Enums.Gender;
    } | null>;
    findPendingVets(): Promise<({
        user: {
            id: string;
            email: string;
            fullName: string;
            createdAt: Date;
        };
        clinic: {
            id: string;
            name: string;
            address: string;
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
    })[]>;
    findVetProfileById(id: string): Promise<{
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
    } | null>;
    updateVetStatus(id: string, status: VerificationStatus): Promise<{
        user: {
            id: string;
            email: string;
            fullName: string;
        };
        clinic: {
            id: string;
            name: string;
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
    }>;
    findPendingSitters(): Promise<({
        images: {
            id: string;
            createdAt: Date;
            imagePath: string;
        }[];
        sitter: {
            id: string;
            email: string;
            fullName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        address: string;
        updatedAt: Date;
        description: string | null;
        verificationStatus: import("../../../generated/prisma").$Enums.VerificationStatus;
        sitterId: string;
        petid: string;
        title: string;
        pricePerDay: number | null;
        ServiceName: string;
    })[]>;
    findSitterListingById(id: string): Promise<{
        id: string;
        createdAt: Date;
        address: string;
        updatedAt: Date;
        description: string | null;
        verificationStatus: import("../../../generated/prisma").$Enums.VerificationStatus;
        sitterId: string;
        petid: string;
        title: string;
        pricePerDay: number | null;
        ServiceName: string;
    } | null>;
    updateSitterStatus(id: string, status: VerificationStatus): Promise<{
        images: {
            id: string;
            imagePath: string;
        }[];
        sitter: {
            id: string;
            email: string;
            fullName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        address: string;
        updatedAt: Date;
        description: string | null;
        verificationStatus: import("../../../generated/prisma").$Enums.VerificationStatus;
        sitterId: string;
        petid: string;
        title: string;
        pricePerDay: number | null;
        ServiceName: string;
    }>;
    findPendingAppointmentPayments(): Promise<({
        appointment: ({
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
        }) | null;
        payer: {
            id: string;
            email: string;
            fullName: string;
        };
        proofAsset: {
            id: string;
            url: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        appointmentId: string | null;
        sittingBookingId: string | null;
        payerId: string;
        method: import("../../../generated/prisma").$Enums.PaymentMethod;
        status: import("../../../generated/prisma").$Enums.PaymentStatus;
        amount: number;
        currency: string;
        proofAssetId: string | null;
        petOwnerProfileId: string | null;
    })[]>;
    findPaymentById(id: string): Promise<({
        appointment: {
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
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        appointmentId: string | null;
        sittingBookingId: string | null;
        payerId: string;
        method: import("../../../generated/prisma").$Enums.PaymentMethod;
        status: import("../../../generated/prisma").$Enums.PaymentStatus;
        amount: number;
        currency: string;
        proofAssetId: string | null;
        petOwnerProfileId: string | null;
    }) | null>;
    approveAppointmentPayment(paymentId: string, appointmentId: string): Promise<[{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        appointmentId: string | null;
        sittingBookingId: string | null;
        payerId: string;
        method: import("../../../generated/prisma").$Enums.PaymentMethod;
        status: import("../../../generated/prisma").$Enums.PaymentStatus;
        amount: number;
        currency: string;
        proofAssetId: string | null;
        petOwnerProfileId: string | null;
    }, {
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
    }]>;
    rejectAppointmentPayment(paymentId: string, appointmentId: string): Promise<[{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        appointmentId: string | null;
        sittingBookingId: string | null;
        payerId: string;
        method: import("../../../generated/prisma").$Enums.PaymentMethod;
        status: import("../../../generated/prisma").$Enums.PaymentStatus;
        amount: number;
        currency: string;
        proofAssetId: string | null;
        petOwnerProfileId: string | null;
    }, {
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
    }]>;
    createAdminActionLog(data: {
        adminId: string;
        action: string;
        entityType?: string;
        entityId?: string;
        meta?: Prisma.InputJsonValue;
    }): Promise<{
        id: string;
        createdAt: Date;
        action: string;
        entityType: string | null;
        entityId: string | null;
        meta: Prisma.JsonValue | null;
        adminId: string;
    }>;
}
export declare const adminRepository: AdminRepository;
//# sourceMappingURL=admin.repository.d.ts.map