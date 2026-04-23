import prisma from "../../config/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "../../common/utils/jwt";
import { UserRole, VerificationStatus } from "../../../generated/prisma";
import { AppError } from "../../common/errors/AppError";

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
      throw new AppError("Email already exists", 409); // Default to 409 Conflict
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

    return { user, token };
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
  }) {
    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new AppError("Email already exists", 409); // Default to 409 Conflict
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
            certificateUrl: data.certificateUrl,
            clinicId: data.clinicId,
            yearsOfExperience: data.yearsOfExperience,
            verificationStatus: VerificationStatus.PENDING,
          },
        },
      },
      include: {
        vetProfile: true,
      },
    });

    // Return message - NO TOKEN until admin approves
    return {
      message: "Vet registered successfully. Waiting for admin approval.",
      user,
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

    return { user, token };
  }
}