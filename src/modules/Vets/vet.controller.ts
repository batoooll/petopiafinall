import { Request, Response, NextFunction } from 'express';
import { VetService } from './vets.service';
import { VerificationStatus } from '../../../generated/prisma';
import { AppError, HttpCode } from '../../common/errors/AppError';

const vetService = new VetService();

export const registerVetProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Get the URL directly from the JSON body
    const { phone, yearsOfExperience, clinicId, certificateUrl } = req.body;

    // 2. Add basic validation to ensure it's a valid link
    if (!certificateUrl || !certificateUrl.startsWith('http')) {
      throw new AppError('A valid certificate URL is required', HttpCode.BAD_REQUEST);
    }

    const profile = await vetService.registerVet(
      req.user!.id, 
      certificateUrl, // Now a string URL
      phone, 
      Number(yearsOfExperience), 
      clinicId
    );

    res.status(201).json({ status: 'success', data: profile });
  } catch (error) {
    next(error);
  }
};

export const updateClinic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { clinicLocation } = req.body;
    const profile = await vetService.updateClinicDetails(req.user!.id, clinicLocation);
    res.status(200).json({ status: 'success', data: profile });
  } catch (error) {
    next(error);
  }
};

export const verifyVet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    // Defensive check: Ensure id is a string
    const vetProfileId = Array.isArray(id) ? id[0] : id;

    if (!vetProfileId) {
        throw new AppError('Vet ID is missing', HttpCode.BAD_REQUEST);
    }

    if (!status || !['PENDING', 'VERIFIED', 'REJECTED'].includes(status)) {
        throw new AppError('Invalid status provided', HttpCode.BAD_REQUEST);
    }

    // Now vetProfileId is guaranteed to be a string
    const profile = await vetService.verifyVet(vetProfileId, status as VerificationStatus);
    
    res.status(200).json({ status: 'success', data: profile });
  } catch (error) {
    next(error);
  }
};