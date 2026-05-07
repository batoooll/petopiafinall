import { Gender } from "../../../generated/prisma";
export declare class PetRepository {
    static findOwnerProfile(userId: string): import("../../../generated/prisma").Prisma.Prisma__PetOwnerProfileClient<{
        id: string;
        phone: string;
        address: string | null;
        idCardPhoto1: string | null;
        idCardPhoto2: string | null;
        locationPhoto1: string | null;
        locationPhoto2: string | null;
        verificationStatus: import("../../../generated/prisma").$Enums.SitterVerificationStatus;
        userId: string;
    } | null, null, import("../../../generated/prisma/runtime/library").DefaultArgs, {
        log: ("warn" | "error")[];
    }>;
    static createPet(data: {
        ownerId: string;
        petOwnerProfileId: string | null;
        name: string;
        age: number;
        breed?: string | null;
        gender?: Gender | null;
    }): import("../../../generated/prisma").Prisma.Prisma__PetClient<{
        images: ({
            asset: {
                id: string;
                createdAt: Date;
                url: string;
                mimeType: string | null;
                sizeBytes: number | null;
                storageKey: string | null;
                uploadedById: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            petId: string;
            assetId: string;
            isPrimary: boolean;
        })[];
    } & {
        id: string;
        age: number;
        gender: import("../../../generated/prisma").$Enums.Gender | null;
        name: string;
        petOwnerProfileId: string | null;
        ownerId: string;
        breed: string | null;
    }, never, import("../../../generated/prisma/runtime/library").DefaultArgs, {
        log: ("warn" | "error")[];
    }>;
    static findPetsByOwner(userId: string, limit?: number, offset?: number): import("../../../generated/prisma").Prisma.PrismaPromise<({
        images: ({
            asset: {
                id: string;
                createdAt: Date;
                url: string;
                mimeType: string | null;
                sizeBytes: number | null;
                storageKey: string | null;
                uploadedById: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            petId: string;
            assetId: string;
            isPrimary: boolean;
        })[];
    } & {
        id: string;
        age: number;
        gender: import("../../../generated/prisma").$Enums.Gender | null;
        name: string;
        petOwnerProfileId: string | null;
        ownerId: string;
        breed: string | null;
    })[]>;
    static findPetById(petId: string): import("../../../generated/prisma").Prisma.Prisma__PetClient<({
        images: ({
            asset: {
                id: string;
                createdAt: Date;
                url: string;
                mimeType: string | null;
                sizeBytes: number | null;
                storageKey: string | null;
                uploadedById: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            petId: string;
            assetId: string;
            isPrimary: boolean;
        })[];
    } & {
        id: string;
        age: number;
        gender: import("../../../generated/prisma").$Enums.Gender | null;
        name: string;
        petOwnerProfileId: string | null;
        ownerId: string;
        breed: string | null;
    }) | null, null, import("../../../generated/prisma/runtime/library").DefaultArgs, {
        log: ("warn" | "error")[];
    }>;
    static updatePet(petId: string, data: {
        name?: string;
        age?: number;
        breed?: string | null;
        gender?: Gender | null;
    }): import("../../../generated/prisma").Prisma.Prisma__PetClient<{
        id: string;
        age: number;
        gender: import("../../../generated/prisma").$Enums.Gender | null;
        name: string;
        petOwnerProfileId: string | null;
        ownerId: string;
        breed: string | null;
    }, never, import("../../../generated/prisma/runtime/library").DefaultArgs, {
        log: ("warn" | "error")[];
    }>;
    static deletePet(petId: string): import("../../../generated/prisma").Prisma.Prisma__PetClient<{
        id: string;
        age: number;
        gender: import("../../../generated/prisma").$Enums.Gender | null;
        name: string;
        petOwnerProfileId: string | null;
        ownerId: string;
        breed: string | null;
    }, never, import("../../../generated/prisma/runtime/library").DefaultArgs, {
        log: ("warn" | "error")[];
    }>;
}
//# sourceMappingURL=pets.repository.d.ts.map