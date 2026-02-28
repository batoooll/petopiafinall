// // src/modules/doctors/doctor.service.ts
// import { PrismaClient, UserRole } from '@prisma/client';
// import { AppError, HttpCode } from '../../common/errors/AppError';

// const prisma = new PrismaClient();

// export class DoctorService {
//   /**
//    * Business Logic: Submit Certificate for Verification
//    * Architectural Reasoning: We validate business rules here (e.g., role check) 
//    * before touching the database.
//    */
//   async submitVerification(userId: string, certificateUrl: string) {
//     const user = await prisma.user.findUnique({ where: { id: userId } });

//     if (!user || user.role !== UserRole.DOCTOR) {
//       throw new AppError("Only accounts registered as Doctors can submit certificates.", HttpCode.BAD_REQUEST);
//     }

//     return await prisma.doctorProfile.update({
//       where: { userId },
//       data: {
//         certificateUrl,
//         verificationStatus: 'PENDING',
//       },
//     });
//   }
// }
import prisma from '../../config/prisma'

export class VetsService {
  async getAllVets() {
   return await prisma.vetProfile.findMany()
  }
}