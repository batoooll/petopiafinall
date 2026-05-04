export declare class AuthService {
    static registerPetOwner(data: {
        email: string;
        password: string;
        fullName: string;
        age: number;
        gender: "MALE" | "FEMALE";
        phone: string;
    }): Promise<{
        user: {
            id: string;
            email: string;
            fullName: string;
            age: number;
            role: import("../../../generated/prisma").$Enums.UserRole;
            createdAt: Date;
            gender: import("../../../generated/prisma").$Enums.Gender;
        };
        token: string;
    }>;
    static registerVet(data: {
        email: string;
        password: string;
        fullName: string;
        age: number;
        gender: "MALE" | "FEMALE";
        phone: string;
        certificateUrl: string;
        clinicId: string;
        yearsOfExperience: number;
        appointmentPrice?: number | string;
        startTime?: string;
        endTime?: string;
    }): Promise<{
        message: string;
        user: {
            vetProfile: {
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
            } | null;
            id: string;
            email: string;
            fullName: string;
            age: number;
            role: import("../../../generated/prisma").$Enums.UserRole;
            createdAt: Date;
            gender: import("../../../generated/prisma").$Enums.Gender;
        };
    }>;
    static login(email: string, password: string): Promise<{
        user: {
            vetProfile: {
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
            } | null;
            id: string;
            email: string;
            fullName: string;
            age: number;
            role: import("../../../generated/prisma").$Enums.UserRole;
            createdAt: Date;
            gender: import("../../../generated/prisma").$Enums.Gender;
        };
        token: string;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map