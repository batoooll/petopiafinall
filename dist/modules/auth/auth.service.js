"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../../common/utils/jwt");
const prisma_2 = require("../../../generated/prisma");
const AppError_1 = require("../../common/errors/AppError");
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12");
class AuthService {
    // REGISTER PET OWNER
    static async registerPetOwner(data) {
        // Check if email already exists
        const existing = await prisma_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (existing) {
            throw new AppError_1.AppError("Email already exists", AppError_1.HttpCode.BAD_REQUEST);
        }
        // Hash password with configurable salt rounds
        const passwordHash = await bcrypt_1.default.hash(data.password, SALT_ROUNDS);
        // Create user with pet owner profile
        const user = await prisma_1.default.user.create({
            data: {
                email: data.email,
                passwordHash,
                fullName: data.fullName,
                age: data.age,
                gender: data.gender,
                role: prisma_2.UserRole.PET_OWNER,
                ownerProfile: {
                    create: {
                        phone: data.phone,
                    },
                },
            },
        });
        // Generate JWT token for immediate access
        const token = (0, jwt_1.generateToken)({
            userId: user.id,
            role: user.role,
        });
        const { passwordHash: _passwordHash, ...safeUser } = user;
        return { user: safeUser, token };
    }
    // REGISTER VET (PENDING - requires admin approval)
    static async registerVet(data) {
        // Check if email already exists
        const existing = await prisma_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (existing) {
            throw new AppError_1.AppError("Email already exists", AppError_1.HttpCode.BAD_REQUEST);
        }
        // Verify clinic exists before creating vet
        const clinic = await prisma_1.default.clinic.findUnique({
            where: { id: data.clinicId },
        });
        if (!clinic) {
            throw new AppError_1.AppError("Clinic not found", 404);
        }
        // Hash password with configurable salt rounds
        const passwordHash = await bcrypt_1.default.hash(data.password, SALT_ROUNDS);
        const appointmentPrice = Number(data.appointmentPrice ?? 0);
        if (!Number.isFinite(appointmentPrice) || appointmentPrice < 0) {
            throw new AppError_1.AppError("appointmentPrice must be a non-negative number", 400);
        }
        const startTime = data.startTime ?? "09:00";
        const endTime = data.endTime ?? "17:00";
        if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(startTime)) {
            throw new AppError_1.AppError("startTime must use HH:mm format", 400);
        }
        if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(endTime)) {
            throw new AppError_1.AppError("endTime must use HH:mm format", 400);
        }
        const [startHour, startMinute] = startTime.split(":").map(Number);
        const [endHour, endMinute] = endTime.split(":").map(Number);
        const startMinutes = startHour * 60 + startMinute;
        const endMinutes = endHour * 60 + endMinute;
        if (endMinutes <= startMinutes) {
            throw new AppError_1.AppError("endTime must be after startTime", 400);
        }
        // Create user with vet profile (PENDING status - no token returned)
        const user = await prisma_1.default.user.create({
            data: {
                email: data.email,
                passwordHash,
                fullName: data.fullName,
                age: data.age,
                gender: data.gender,
                role: prisma_2.UserRole.VET,
                vetProfile: {
                    create: {
                        phone: data.phone,
                        certificateImage: data.certificateUrl,
                        clinicId: data.clinicId,
                        yearsOfExperience: data.yearsOfExperience,
                        appointmentPrice,
                        startTime,
                        endTime,
                        verificationStatus: prisma_2.VerificationStatus.PENDING,
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
    static async login(email, password) {
        // Find user with vet profile if applicable
        const user = await prisma_1.default.user.findUnique({
            where: { email },
            include: {
                vetProfile: true,
            },
        });
        if (!user) {
            throw new AppError_1.AppError("Invalid email or password", 401);
        }
        // Verify password
        const valid = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!valid) {
            throw new AppError_1.AppError("Invalid email or password", 401);
        }
        // IMPORTANT: Vet must be VERIFIED to login
        if (user.role === prisma_2.UserRole.VET) {
            if (!user.vetProfile) {
                throw new AppError_1.AppError("Vet profile not found", 403);
            }
            if (user.vetProfile.verificationStatus === prisma_2.VerificationStatus.PENDING) {
                throw new AppError_1.AppError("Your account is pending admin approval", 403);
            }
            if (user.vetProfile.verificationStatus === prisma_2.VerificationStatus.REJECTED) {
                throw new AppError_1.AppError("Your account was rejected by admin", 403);
            }
        }
        // Generate JWT token for authenticated user
        const token = (0, jwt_1.generateToken)({
            userId: user.id,
            role: user.role,
        });
        const { passwordHash: _passwordHash, ...safeUser } = user;
        return { user: safeUser, token };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map