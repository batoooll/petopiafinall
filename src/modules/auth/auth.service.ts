import prisma from "../../config/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "../../common/utils/jwt";
import { UserRole, VerificationStatus } from "../../../generated/prisma";

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

    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing)
      throw new Error("Email already exists");

    const passwordHash = await bcrypt.hash(data.password, 10);

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

    const token = generateToken({
      userId: user.id,
      role: user.role,
    });

    return { user, token };
  }

  // REGISTER VET (PENDING)
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

    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing)
      throw new Error("Email already exists");

    const passwordHash = await bcrypt.hash(data.password, 10);

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

    return {
      message: "Vet registered successfully. Waiting for admin approval.",
      user,
    };
  }

  // LOGIN
  static async login(email: string, password: string) {

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        vetProfile: true,
      },
    });

    if (!user)
      throw new Error("Invalid email or password");

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid)
      throw new Error("Invalid email or password");


    // IMPORTANT: Vet must be VERIFIED
    if (user.role === UserRole.VET) {

      if (!user.vetProfile)
        throw new Error("Vet profile not found");

      if (user.vetProfile.verificationStatus === VerificationStatus.PENDING)
        throw new Error("Your account is pending admin approval");

      if (user.vetProfile.verificationStatus === VerificationStatus.REJECTED)
        throw new Error("Your account was rejected by admin");

    }


    const token = generateToken({
      userId: user.id,
      role: user.role,
    });

    return { user, token };
  }

}