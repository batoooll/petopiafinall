// src/modules/vets/vet.service.ts
import prisma from '../../config/prisma';
import { AppError, HttpCode } from '../../common/errors/AppError';
import { VerificationStatus } from '../../../generated/prisma';

export class VetService {

  async registerVet(
    userId: string, 
    certificateUrl: string,
    phone: string,
    yearsOfExperience: number,
    clinicId: string
  ) {
    // 1. Check if the clinic actually exists first
    const clinicExists = await prisma.clinic.findUnique({ where: { id: clinicId } });
    if (!clinicExists) {
      throw new AppError('The selected clinic does not exist.', HttpCode.BAD_REQUEST);
    }

    // 2. Proceed with registration
    return await prisma.vetProfile.create({
      data: {
        userId,
        certificateUrl,
        phone,
        yearsOfExperience,
        clinicId,
        verificationStatus: VerificationStatus.PENDING,
      }
    });
  }


  async verifyVet(vetProfileId: string, status: VerificationStatus) {
    const profile = await prisma.vetProfile.findUnique({ where: { id: vetProfileId } });
    
    if (!profile) {
      throw new AppError('Vet profile not found', HttpCode.NOT_FOUND);
    }

    return await prisma.vetProfile.update({
      where: { id: vetProfileId },
      data: { verificationStatus: status }
    });
  }

  async updateClinicDetails(userId: string, clinicLocation: string) {
  // 1. Find the profile to get the linked clinicId
  const profile = await prisma.vetProfile.findUnique({ 
    where: { userId },
    select: { clinicId: true, verificationStatus: true } // Select only what we need
  });
  
  if (!profile) {
    throw new AppError('Vet profile not found', HttpCode.NOT_FOUND);
  }

  // 2. Enforce business rule
  if (profile.verificationStatus !== VerificationStatus.VERIFIED) {
    throw new AppError('Clinic setup is only allowed for verified Vets', HttpCode.FORBIDDEN);
  }

  // 3. Update the Clinic record directly using the clinicId
  return await prisma.clinic.update({
    where: { id: profile.clinicId }, // Use the ID found in the profile
    data: { address: clinicLocation } // Update the specific field
  });
}

}