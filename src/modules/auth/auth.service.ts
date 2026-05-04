import prisma from "../../config/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "../../common/utils/jwt";
import { UserRole, VerificationStatus } from "../../../generated/prisma";
import { AppError, HttpCode } from "../../common/errors/AppError";

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12");

export class AuthService {
  // REGISTER PET OWNER
  static async registerPetOwner(data: {
    email: string;
    password: string;
    fullName: string;
    age: number;
    gender: "MALE" | "FEMALE";
    phone: string;
  }) {
    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new AppError("Email already exists", HttpCode.BAD_REQUEST);
    }

    // Hash password with configurable salt rounds
    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

    // Create user with pet owner profile
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        fullName: data.fullName,
        age: data.age,
        gender: data.gender,
        role: UserRole.PET_OWNER,

        ownerProfile: {
          create: {
            phone: data.phone,
          },
        },
      },
    });

    // Generate JWT token for immediate access
    const token = generateToken({
      userId: user.id,
      role: user.role,
    });

    const { passwordHash: _passwordHash, ...safeUser } = user;
    return { user: safeUser, token };
  }

  // REGISTER VET (PENDING - requires admin approval)
  static async registerVet(data: {
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
  }) {
    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new AppError("Email already exists", HttpCode.BAD_REQUEST);
    }

    // Verify clinic exists before creating vet
    const clinic = await prisma.clinic.findUnique({
      where: { id: data.clinicId },
    });

    if (!clinic) {
      throw new AppError("Clinic not found", 404);
    }

    // Hash password with configurable salt rounds
    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
    const appointmentPrice = Number(data.appointmentPrice ?? 0);

    if (!Number.isFinite(appointmentPrice) || appointmentPrice < 0) {
      throw new AppError("appointmentPrice must be a non-negative number", 400);
    }

    const startTime = data.startTime ?? "09:00";
    const endTime = data.endTime ?? "17:00";

    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(startTime)) {
      throw new AppError("startTime must use HH:mm format", 400);
    }

    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(endTime)) {
      throw new AppError("endTime must use HH:mm format", 400);
    }

    const [startHour, startMinute] = startTime.split(":").map(Number) as [number, number];
    const [endHour, endMinute] = endTime.split(":").map(Number) as [number, number];
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    if (endMinutes <= startMinutes) {
      throw new AppError("endTime must be after startTime", 400);
    }

    // Create user with vet profile (PENDING status - no token returned)
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        fullName: data.fullName,
        age: data.age,
        gender: data.gender,
        role: UserRole.VET,

        vetProfile: {
          create: {
            phone: data.phone,
            certificateImage: data.certificateUrl,
            clinicId: data.clinicId,
            yearsOfExperience: data.yearsOfExperience,
            appointmentPrice,
            startTime,
            endTime,
            verificationStatus: VerificationStatus.PENDING,
          },
        },
      },
      include: {
        vetProfile: true,
      },
    });

    // Return message - NO TOKEN until admin approves
    const { passwordHash: _passwordHash, ...safeUser } = user;
    return {
      message: "Vet registered successfully. Waiting for admin approval.",
      user: safeUser,
    };
  }

  // LOGIN
  static async login(email: string, password: string) {
    // Find user with vet profile if applicable
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        vetProfile: true,
      },
    });

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      throw new AppError("Invalid email or password", 401);
    }

    // IMPORTANT: Vet must be VERIFIED to login
    if (user.role === UserRole.VET) {
      if (!user.vetProfile) {
        throw new AppError("Vet profile not found", 403);
      }

      if (user.vetProfile.verificationStatus === VerificationStatus.PENDING) {
        throw new AppError("Your account is pending admin approval", 403);
      }

      if (user.vetProfile.verificationStatus === VerificationStatus.REJECTED) {
        throw new AppError("Your account was rejected by admin", 403);
      }
    }

    // Generate JWT token for authenticated user
    const token = generateToken({
      userId: user.id,
      role: user.role,
    });

    const { passwordHash: _passwordHash, ...safeUser } = user;
    return { user: safeUser, token };
  }
}
