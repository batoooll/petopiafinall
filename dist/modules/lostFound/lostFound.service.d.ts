import { ReportLostPetInput, ReportFoundPetInput } from "./lostFound.dto";
export declare class LostFoundService {
    static reportLostPet(userId: string, input: ReportLostPetInput, imageBuffers: {
        buffer: Buffer;
        filename: string;
    }[], baseUrl: string): Promise<{
        owner: {
            id: string;
            email: string;
            fullName: string;
        } | null;
        images: {
            id: string;
            createdAt: Date;
            storageKey: string | null;
            url: string;
            reportId: string;
        }[];
        finder: {
            id: string;
            email: string;
            fullName: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        gender: import("../../../generated/prisma").$Enums.Gender | null;
        name: string | null;
        updatedAt: Date;
        description: string;
        ownerId: string | null;
        breed: string | null;
        status: import("../../../generated/prisma").$Enums.LostFoundStatus;
        species: import("../../../generated/prisma").$Enums.PetType;
        color: string | null;
        lastSeenLocation: string | null;
        lastSeenDate: Date | null;
        foundLocation: string | null;
        isPetStillAtLocation: boolean;
        finderId: string | null;
    }>;
    private static cleanupAfterLostReport;
    private static sendSystemMessage;
    static reportFoundPet(userId: string, input: ReportFoundPetInput, imageBuffers: {
        buffer: Buffer;
        filename: string;
    }[], baseUrl: string): Promise<{
        owner: {
            id: string;
            email: string;
            fullName: string;
        } | null;
        images: {
            id: string;
            createdAt: Date;
            storageKey: string | null;
            url: string;
            reportId: string;
        }[];
        finder: {
            id: string;
            email: string;
            fullName: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        gender: import("../../../generated/prisma").$Enums.Gender | null;
        name: string | null;
        updatedAt: Date;
        description: string;
        ownerId: string | null;
        breed: string | null;
        status: import("../../../generated/prisma").$Enums.LostFoundStatus;
        species: import("../../../generated/prisma").$Enums.PetType;
        color: string | null;
        lastSeenLocation: string | null;
        lastSeenDate: Date | null;
        foundLocation: string | null;
        isPetStillAtLocation: boolean;
        finderId: string | null;
    }>;
    static getLostReports(): Promise<({
        owner: {
            id: string;
            email: string;
            fullName: string;
        } | null;
        images: {
            id: string;
            createdAt: Date;
            storageKey: string | null;
            url: string;
            reportId: string;
        }[];
        finder: {
            id: string;
            email: string;
            fullName: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        gender: import("../../../generated/prisma").$Enums.Gender | null;
        name: string | null;
        updatedAt: Date;
        description: string;
        ownerId: string | null;
        breed: string | null;
        status: import("../../../generated/prisma").$Enums.LostFoundStatus;
        species: import("../../../generated/prisma").$Enums.PetType;
        color: string | null;
        lastSeenLocation: string | null;
        lastSeenDate: Date | null;
        foundLocation: string | null;
        isPetStillAtLocation: boolean;
        finderId: string | null;
    })[]>;
    static getFoundReports(): Promise<({
        owner: {
            id: string;
            email: string;
            fullName: string;
        } | null;
        images: {
            id: string;
            createdAt: Date;
            storageKey: string | null;
            url: string;
            reportId: string;
        }[];
        finder: {
            id: string;
            email: string;
            fullName: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        gender: import("../../../generated/prisma").$Enums.Gender | null;
        name: string | null;
        updatedAt: Date;
        description: string;
        ownerId: string | null;
        breed: string | null;
        status: import("../../../generated/prisma").$Enums.LostFoundStatus;
        species: import("../../../generated/prisma").$Enums.PetType;
        color: string | null;
        lastSeenLocation: string | null;
        lastSeenDate: Date | null;
        foundLocation: string | null;
        isPetStillAtLocation: boolean;
        finderId: string | null;
    })[]>;
    static deleteFoundReport(userId: string, reportId: string): Promise<void>;
}
//# sourceMappingURL=lostFound.service.d.ts.map