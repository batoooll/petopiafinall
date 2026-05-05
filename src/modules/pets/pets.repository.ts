import prisma from "../../config/prisma";
import { Gender } from "../../../generated/prisma";

export class PetRepository {

  static findOwnerProfile(userId: string) {
    return prisma.petOwnerProfile.findUnique({
      where: { userId },
    });
  }

  static createPet(data: {
    ownerId: string;
    petOwnerProfileId: string | null;
    name: string;
    age: number;
    breed?: string | null;
    gender?: Gender | null;
  }) {
    return prisma.pet.create({
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

  static findPetsByOwner(userId: string, limit = 10, offset = 0) {
    return prisma.pet.findMany({
      where: { ownerId: userId },
      take: limit,
      skip: offset,
      orderBy: { id: "desc" as const },
      include: {
        images: { include: { asset: true } },
      },
    });
  }

  static findPetById(petId: string) {
    return prisma.pet.findUnique({
      where: { id: petId },
      include: {
        images: { include: { asset: true } },
      },
    });
  }

  static updatePet(
    petId: string,
    data: {
      name?: string;
      age?: number;
      breed?: string | null;
      gender?: Gender | null;
    }
  ) {
    return prisma.pet.update({
      where: { id: petId },
      data,
    });
  }

  static deletePet(petId: string) {
    return prisma.pet.delete({
      where: { id: petId },
    });
  }
}