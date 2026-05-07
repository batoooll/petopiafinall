import { CreatePetDto, UpdatePetDto } from "./pets.dto";
export declare class PetService {
    private static parsePagination;
    static createPet(userId: string, dto: CreatePetDto): Promise<{
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
    }>;
    static getMyPets(userId: string, query: Record<string, unknown>): Promise<({
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
    static getPetById(userId: string, petId: string): Promise<({
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
    }) | null>;
    static updatePet(userId: string, petId: string, dto: UpdatePetDto): Promise<{
        id: string;
        age: number;
        gender: import("../../../generated/prisma").$Enums.Gender | null;
        name: string;
        petOwnerProfileId: string | null;
        ownerId: string;
        breed: string | null;
    }>;
    static deletePet(userId: string, petId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
//# sourceMappingURL=pets.service.d.ts.map