import { PetType, Gender } from "../../../generated/prisma";
export interface CreateLostReportData {
    ownerId: string;
    species: PetType;
    description: string;
    lastSeenLocation: string;
    lastSeenDate: Date;
    name?: string;
    breed?: string;
    gender?: Gender;
    color?: string;
    imageUrls: string[];
}
export interface CreateFoundReportData {
    finderId: string;
    species: PetType;
    description: string;
    foundLocation: string;
    isPetStillAtLocation: boolean;
    breed?: string;
    gender?: Gender;
    color?: string;
    imageUrls: string[];
}
export declare class LostFoundRepository {
    static createLostReport(data: CreateLostReportData): Promise<{
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
    static createFoundReport(data: CreateFoundReportData): Promise<{
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
    static getReportById(id: string): Promise<({
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
    }) | null>;
    static deleteFoundReport(id: string, finderId: string): Promise<import("../../../generated/prisma").Prisma.BatchPayload>;
}
//# sourceMappingURL=lostFound.repository.d.ts.map