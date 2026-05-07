"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetRepository = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
class PetRepository {
    static findOwnerProfile(userId) {
        return prisma_1.default.petOwnerProfile.findUnique({
            where: { userId },
        });
    }
    static createPet(data) {
        return prisma_1.default.pet.create({
            data: {
                name: data.name,
                age: data.age,
                breed: data.breed ?? null,
                gender: data.gender ?? null,
                owner: { connect: { id: data.ownerId } },
                ...(data.petOwnerProfileId
                    ? { petOwnerProfile: { connect: { id: data.petOwnerProfileId } } }
                    : {}),
            },
            include: {
                images: { include: { asset: true } },
            },
        });
    }
    static findPetsByOwner(userId, limit = 10, offset = 0) {
        return prisma_1.default.pet.findMany({
            where: { ownerId: userId },
            take: limit,
            skip: offset,
            orderBy: { id: "desc" },
            include: {
                images: { include: { asset: true } },
            },
        });
    }
    static findPetById(petId) {
        return prisma_1.default.pet.findUnique({
            where: { id: petId },
            include: {
                images: { include: { asset: true } },
            },
        });
    }
    static updatePet(petId, data) {
        return prisma_1.default.pet.update({
            where: { id: petId },
            data,
        });
    }
    static deletePet(petId) {
        return prisma_1.default.pet.delete({
            where: { id: petId },
        });
    }
}
exports.PetRepository = PetRepository;
//# sourceMappingURL=pets.repository.js.map