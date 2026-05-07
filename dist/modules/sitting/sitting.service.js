"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SittingService = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const AppError_1 = require("../../common/errors/AppError");
const sitting_repository_1 = require("./sitting.repository");
const index_1 = require("../../integrations/storage/index");
const sitting_dto_1 = require("./sitting.dto");
class SittingService {
    static async getOwnerAndSitterProfile(userId) {
        const [ownerProfile, sitterProfile] = await Promise.all([
            prisma_1.default.petOwnerProfile.findUnique({ where: { userId } }),
            sitting_repository_1.SittingRepository.getSitterProfileByUserId(userId),
        ]);
        return { ownerProfile, sitterProfile };
    }
    static hasRequiredIdCardImages(ownerProfile) {
        return Boolean(ownerProfile.idCardPhoto1 && ownerProfile.idCardPhoto2);
    }
    static async hasRequiredSitterPhotos(sitterProfileId, ownerHasProfilePhoto) {
        const images = await sitting_repository_1.SittingRepository.getSitterImages(sitterProfileId);
        const profilePhotosCount = images.filter((image) => image.isPrimary).length;
        const placePhotosCount = images.length;
        return {
            profilePhotosCount,
            placePhotosCount,
            hasProfilePhoto: ownerHasProfilePhoto || profilePhotosCount >= sitting_dto_1.MIN_SITTER_PROFILE_PHOTOS,
            hasMinPlacePhotos: placePhotosCount >= sitting_dto_1.MIN_SITTER_PLACE_PHOTOS,
        };
    }
    static async ensureSitterAccessRequirements(userId, overrideSitterProfileId) {
        const { ownerProfile, sitterProfile } = await this.getOwnerAndSitterProfile(userId);
        const sitterProfileId = overrideSitterProfileId ?? sitterProfile?.id;
        if (!ownerProfile) {
            throw new AppError_1.AppError("Pet owner profile not found. Please create one first.", AppError_1.HttpCode.NOT_FOUND);
        }
        if (!this.hasRequiredIdCardImages(ownerProfile)) {
            throw new AppError_1.AppError(`Exactly ${sitting_dto_1.REQUIRED_ID_CARD_IMAGES} ID card images are required before using sitter services`, AppError_1.HttpCode.BAD_REQUEST);
        }
        if (!sitterProfileId) {
            throw new AppError_1.AppError("Sitter profile not found. Please create one first.", AppError_1.HttpCode.NOT_FOUND);
        }
        const ownerHasProfilePhoto = Boolean(ownerProfile.profilePhoto);
        const photoState = await this.hasRequiredSitterPhotos(sitterProfileId, ownerHasProfilePhoto);
        if (!photoState.hasProfilePhoto) {
            throw new AppError_1.AppError("A profile photo is required before enabling sitter profile or using sitter services", AppError_1.HttpCode.BAD_REQUEST);
        }
        if (!photoState.hasMinPlacePhotos) {
            throw new AppError_1.AppError(`At least ${sitting_dto_1.MIN_SITTER_PLACE_PHOTOS} place photos are required before enabling sitter profile or using sitter services`, AppError_1.HttpCode.BAD_REQUEST);
        }
        return { ownerProfile, sitterProfileId, photoState };
    }
    // ─────────────────────────────────────────────────────────────────────────────
    // Sitter Profile Operations
    // ─────────────────────────────────────────────────────────────────────────────
    static async createSitterProfile(userId, input) {
        // Verify user exists
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new AppError_1.AppError("User not found", AppError_1.HttpCode.NOT_FOUND);
        }
        // Get pet owner profile
        const ownerProfile = await prisma_1.default.petOwnerProfile.findUnique({
            where: { userId },
        });
        if (!ownerProfile) {
            throw new AppError_1.AppError("Pet owner profile not found. Please create one first.", AppError_1.HttpCode.NOT_FOUND);
        }
        // REQUIREMENT: Exactly 2 ID card images are mandatory.
        if (!this.hasRequiredIdCardImages(ownerProfile)) {
            throw new AppError_1.AppError(`Exactly ${sitting_dto_1.REQUIRED_ID_CARD_IMAGES} ID card images are required before creating a sitter profile`, AppError_1.HttpCode.BAD_REQUEST);
        }
        const profile = await sitting_repository_1.SittingRepository.createSitterProfile({
            userId,
            petOwnerProfileId: ownerProfile.id,
            supportedPetTypes: input.supportedPetTypes,
            maxPets: input.maxPets,
            city: input.city,
            address: input.address,
            emergencyContact: input.emergencyContact,
            ...(input.bio ? { bio: input.bio } : {}),
            isAvailable: false,
        });
        const ownerProfilePhoto = ownerProfile.profilePhoto;
        if (ownerProfilePhoto) {
            const existingImages = await sitting_repository_1.SittingRepository.getSitterImages(profile.id);
            const hasPrimaryImage = existingImages.some((image) => image.isPrimary);
            if (!hasPrimaryImage) {
                await sitting_repository_1.SittingRepository.createSitterImage({
                    sitterProfileId: profile.id,
                    imageUrl: ownerProfilePhoto,
                    storageKey: `owner-profile-reuse:${ownerProfile.id}`,
                    uploadedById: userId,
                    isPrimary: true,
                });
            }
        }
        return profile;
    }
    static async getSitterProfileMe(userId) {
        const profile = await sitting_repository_1.SittingRepository.getSitterProfileByUserId(userId);
        if (!profile) {
            throw new AppError_1.AppError("Sitter profile not found. Please create one first.", AppError_1.HttpCode.NOT_FOUND);
        }
        return profile;
    }
    static async getSitterProfile(sitterId) {
        const profile = await sitting_repository_1.SittingRepository.getSitterProfileById(sitterId);
        if (!profile) {
            throw new AppError_1.AppError("Sitter profile not found", AppError_1.HttpCode.NOT_FOUND);
        }
        return profile;
    }
    static async updateSitterProfile(userId, input) {
        // Verify profile exists
        const profile = await sitting_repository_1.SittingRepository.getSitterProfileByUserId(userId);
        if (!profile) {
            throw new AppError_1.AppError("Sitter profile not found. Please create one first.", AppError_1.HttpCode.NOT_FOUND);
        }
        // REQUIREMENT: enforce full sitter access requirements before activating.
        if (input.isAvailable === true) {
            await this.ensureSitterAccessRequirements(userId, profile.id);
        }
        const updated = await sitting_repository_1.SittingRepository.updateSitterProfile(userId, input);
        return updated;
    }
    // ─────────────────────────────────────────────────────────────────────────────
    // Sitter Image Operations
    // ─────────────────────────────────────────────────────────────────────────────
    static async uploadSitterImage(userId, file, input) {
        if (!file) {
            throw new AppError_1.AppError("No file provided", AppError_1.HttpCode.BAD_REQUEST);
        }
        // Verify profile exists
        const profile = await sitting_repository_1.SittingRepository.getSitterProfileByUserId(userId);
        if (!profile) {
            throw new AppError_1.AppError("Sitter profile not found. Please create one first.", AppError_1.HttpCode.NOT_FOUND);
        }
        // Validate file is an image
        if (!file.mimetype.startsWith("image/")) {
            throw new AppError_1.AppError("Only image files are allowed", AppError_1.HttpCode.BAD_REQUEST);
        }
        // Upload file using storage client
        const uploadResult = await index_1.storageClient.upload(file.buffer, file.originalname, `sitter-images/${profile.id}`, { mimeType: file.mimetype });
        // Save image metadata to database
        const image = await sitting_repository_1.SittingRepository.createSitterImage({
            sitterProfileId: profile.id,
            imageUrl: uploadResult.url,
            storageKey: uploadResult.storageKey,
            uploadedById: userId,
            isPrimary: input.isPrimary,
        });
        return image;
    }
    static async getSitterImages(userId) {
        const profile = await sitting_repository_1.SittingRepository.getSitterProfileByUserId(userId);
        if (!profile) {
            throw new AppError_1.AppError("Sitter profile not found", AppError_1.HttpCode.NOT_FOUND);
        }
        return sitting_repository_1.SittingRepository.getSitterImages(profile.id);
    }
    static async deleteSitterImage(userId, imageId) {
        // Verify profile exists
        const profile = await sitting_repository_1.SittingRepository.getSitterProfileByUserId(userId);
        if (!profile) {
            throw new AppError_1.AppError("Sitter profile not found", AppError_1.HttpCode.NOT_FOUND);
        }
        // Verify image belongs to this sitter
        const image = await prisma_1.default.sitterImage.findUnique({
            where: { id: imageId },
        });
        if (!image || image.sitterProfileId !== profile.id) {
            throw new AppError_1.AppError("Image not found or does not belong to your profile", AppError_1.HttpCode.NOT_FOUND);
        }
        // Keep active sitters compliant with minimum place photos.
        if (profile.isAvailable) {
            const images = await sitting_repository_1.SittingRepository.getSitterImages(profile.id);
            const remainingImages = images.filter((img) => img.id !== imageId);
            const ownerProfile = await prisma_1.default.petOwnerProfile.findUnique({
                where: { userId },
            });
            const ownerHasProfilePhoto = Boolean(ownerProfile?.profilePhoto);
            const hasProfilePhotoAfterDelete = ownerHasProfilePhoto ||
                remainingImages.some((remainingImage) => remainingImage.isPrimary);
            if (remainingImages.length < sitting_dto_1.MIN_SITTER_PLACE_PHOTOS) {
                throw new AppError_1.AppError(`Active sitters must keep at least ${sitting_dto_1.MIN_SITTER_PLACE_PHOTOS} place photos`, AppError_1.HttpCode.BAD_REQUEST);
            }
            if (!hasProfilePhotoAfterDelete) {
                throw new AppError_1.AppError("Active sitters must keep a profile photo", AppError_1.HttpCode.BAD_REQUEST);
            }
        }
        // Delete file from storage unless image was reused from owner profile.
        if (!image.storageKey.startsWith("owner-profile-reuse:")) {
            await index_1.storageClient.delete(image.storageKey);
        }
        // Delete image record from database
        await sitting_repository_1.SittingRepository.deleteSitterImage(imageId);
        return { message: "Image deleted successfully" };
    }
    // ─────────────────────────────────────────────────────────────────────────────
    // Pet Owner Verification Photos (Shared with Sitter Profile)
    // ─────────────────────────────────────────────────────────────────────────────
    static async uploadIdCardPhoto(userId, file, input) {
        if (!file) {
            throw new AppError_1.AppError("No file provided", AppError_1.HttpCode.BAD_REQUEST);
        }
        // Validate file is an image
        if (!file.mimetype.startsWith("image/")) {
            throw new AppError_1.AppError("Only image files are allowed", AppError_1.HttpCode.BAD_REQUEST);
        }
        // Get or create pet owner profile
        let ownerProfile = await prisma_1.default.petOwnerProfile.findUnique({
            where: { userId },
        });
        if (!ownerProfile) {
            throw new AppError_1.AppError("Pet owner profile not found. Please create one first.", AppError_1.HttpCode.NOT_FOUND);
        }
        // Upload file using storage client
        const uploadResult = await index_1.storageClient.upload(file.buffer, file.originalname, `owner-verification/id-cards/${ownerProfile.id}`, { mimeType: file.mimetype });
        // Update pet owner profile with ID card photo
        const fieldName = input.photoNumber === "1" ? "idCardPhoto1" : "idCardPhoto2";
        const updated = await prisma_1.default.petOwnerProfile.update({
            where: { userId },
            data: {
                [fieldName]: uploadResult.url,
            },
            include: {
                sitterProfile: true,
            },
        });
        return {
            photoNumber: input.photoNumber,
            url: uploadResult.url,
            message: `ID card photo ${input.photoNumber} uploaded successfully`,
            data: updated,
        };
    }
    static async uploadLocationPhoto(userId, file, input) {
        if (!file) {
            throw new AppError_1.AppError("No file provided", AppError_1.HttpCode.BAD_REQUEST);
        }
        // Validate file is an image
        if (!file.mimetype.startsWith("image/")) {
            throw new AppError_1.AppError("Only image files are allowed", AppError_1.HttpCode.BAD_REQUEST);
        }
        // Get pet owner profile
        let ownerProfile = await prisma_1.default.petOwnerProfile.findUnique({
            where: { userId },
        });
        if (!ownerProfile) {
            throw new AppError_1.AppError("Pet owner profile not found. Please create one first.", AppError_1.HttpCode.NOT_FOUND);
        }
        // Upload file using storage client
        const uploadResult = await index_1.storageClient.upload(file.buffer, file.originalname, `owner-verification/locations/${ownerProfile.id}`, { mimeType: file.mimetype });
        // Update pet owner profile with location photo
        const fieldName = input.photoNumber === "1" ? "locationPhoto1" : "locationPhoto2";
        const updated = await prisma_1.default.petOwnerProfile.update({
            where: { userId },
            data: {
                [fieldName]: uploadResult.url,
            },
            include: {
                sitterProfile: true,
            },
        });
        return {
            photoNumber: input.photoNumber,
            url: uploadResult.url,
            message: `Location photo ${input.photoNumber} uploaded successfully`,
            data: updated,
        };
    }
    static async getVerificationPhotos(userId) {
        const ownerProfile = await prisma_1.default.petOwnerProfile.findUnique({
            where: { userId },
            select: {
                id: true,
                idCardPhoto1: true,
                idCardPhoto2: true,
                locationPhoto1: true,
                locationPhoto2: true,
                verificationStatus: true,
                sitterProfile: {
                    select: {
                        id: true,
                        verificationStatus: true,
                    },
                },
            },
        });
        if (!ownerProfile) {
            throw new AppError_1.AppError("Pet owner profile not found", AppError_1.HttpCode.NOT_FOUND);
        }
        return ownerProfile;
    }
    // ─────────────────────────────────────────────────────────────────────────────
    // Sitter Availability Operations
    // ─────────────────────────────────────────────────────────────────────────────
    static async addAvailability(userId, input) {
        // Verify profile exists
        const profile = await sitting_repository_1.SittingRepository.getSitterProfileByUserId(userId);
        if (!profile) {
            throw new AppError_1.AppError("Sitter profile not found. Please create one first.", AppError_1.HttpCode.NOT_FOUND);
        }
        await this.ensureSitterAccessRequirements(userId, profile.id);
        const availability = await sitting_repository_1.SittingRepository.addAvailability({
            sitterProfileId: profile.id,
            userId,
            startDate: input.startDate,
            endDate: input.endDate,
        });
        return availability;
    }
    static async getMyAvailability(userId) {
        const profile = await sitting_repository_1.SittingRepository.getSitterProfileByUserId(userId);
        if (!profile) {
            throw new AppError_1.AppError("Sitter profile not found", AppError_1.HttpCode.NOT_FOUND);
        }
        await this.ensureSitterAccessRequirements(userId, profile.id);
        return sitting_repository_1.SittingRepository.getSitterAvailability(profile.id);
    }
    static async deleteAvailability(userId, availabilityId) {
        // Verify profile exists
        const profile = await sitting_repository_1.SittingRepository.getSitterProfileByUserId(userId);
        if (!profile) {
            throw new AppError_1.AppError("Sitter profile not found", AppError_1.HttpCode.NOT_FOUND);
        }
        // Verify availability belongs to this sitter
        const availability = await prisma_1.default.sitterAvailability.findUnique({
            where: { id: availabilityId },
        });
        if (!availability || availability.sitterProfileId !== profile.id) {
            throw new AppError_1.AppError("Availability not found or does not belong to your profile", AppError_1.HttpCode.NOT_FOUND);
        }
        await sitting_repository_1.SittingRepository.deleteAvailability(availabilityId);
        return { message: "Availability deleted successfully" };
    }
    // ─────────────────────────────────────────────────────────────────────────────
    // Sitting Booking Operations
    // ─────────────────────────────────────────────────────────────────────────────
    static async createBooking(userId, input) {
        // Verify pet ownership
        const pet = await prisma_1.default.pet.findUnique({
            where: { id: input.petId },
            select: { ownerId: true },
        });
        if (!pet || pet.ownerId !== userId) {
            throw new AppError_1.AppError("Pet not found or does not belong to you", AppError_1.HttpCode.NOT_FOUND);
        }
        // Verify sitter exists and is approved
        const sitterProfile = await sitting_repository_1.SittingRepository.getSitterProfileById(input.sitterId);
        if (!sitterProfile) {
            throw new AppError_1.AppError("Sitter not found", AppError_1.HttpCode.NOT_FOUND);
        }
        // REQUIREMENT: Only APPROVED sitters can receive bookings
        if (sitterProfile.verificationStatus !== "APPROVED") {
            throw new AppError_1.AppError("This sitter is not approved to receive bookings", AppError_1.HttpCode.BAD_REQUEST);
        }
        // REQUIREMENT: Sitter must be marked as available
        if (!sitterProfile.isAvailable) {
            throw new AppError_1.AppError("Sitter is not currently available", AppError_1.HttpCode.BAD_REQUEST);
        }
        await this.ensureSitterAccessRequirements(sitterProfile.userId, sitterProfile.id);
        // Cannot book own profile
        if (sitterProfile.userId === userId) {
            throw new AppError_1.AppError("You cannot book your own sitter profile", AppError_1.HttpCode.BAD_REQUEST);
        }
        // Check if sitter is available
        const isAvailable = await sitting_repository_1.SittingRepository.checkAvailability(sitterProfile.id, input.startDate, input.endDate);
        if (!isAvailable) {
            throw new AppError_1.AppError("Sitter is not available for the requested dates", AppError_1.HttpCode.BAD_REQUEST);
        }
        // REQUIREMENT: Enforce pet limit constraint (max 3 pets at same time)
        const overlappingBookings = await sitting_repository_1.SittingRepository.countOverlappingAcceptedBookings(sitterProfile.id, input.startDate, input.endDate);
        if (overlappingBookings >= 3) {
            throw new AppError_1.AppError("Sitter has reached maximum pet capacity for this date range", AppError_1.HttpCode.BAD_REQUEST);
        }
        // Create booking
        const totalDays = Math.ceil((input.endDate.getTime() - input.startDate.getTime()) / (1000 * 60 * 60 * 24));
        const booking = await sitting_repository_1.SittingRepository.createSittingBooking({
            sitterProfileId: sitterProfile.id,
            sitterId: sitterProfile.userId,
            petOwnerId: userId,
            petId: input.petId,
            startDate: input.startDate,
            endDate: input.endDate,
            totalDays,
            ...(input.ownerNotes ? { ownerNotes: input.ownerNotes } : {}),
            emergencyPhone: input.emergencyPhone,
        });
        return booking;
    }
    static async getMyBookingsAsSitter(userId, page = 1, limit = 10) {
        await this.ensureSitterAccessRequirements(userId);
        return sitting_repository_1.SittingRepository.getSitterBookings(userId, undefined, page, limit);
    }
    static async getIncomingBookingsAsSitter(userId, page = 1, limit = 10) {
        await this.ensureSitterAccessRequirements(userId);
        const { bookings, total } = await sitting_repository_1.SittingRepository.getSitterBookings(userId, "PENDING", page, limit);
        return { bookings, total };
    }
    static async getMyBookingsAsOwner(userId, page = 1, limit = 10) {
        return sitting_repository_1.SittingRepository.getOwnerBookings(userId, undefined, page, limit);
    }
    static async acceptBooking(userId, bookingId) {
        await this.ensureSitterAccessRequirements(userId);
        // Get booking
        const booking = await sitting_repository_1.SittingRepository.getSittingBookingById(bookingId);
        if (!booking) {
            throw new AppError_1.AppError("Booking not found", AppError_1.HttpCode.NOT_FOUND);
        }
        // Verify ownership
        if (booking.sitterId !== userId) {
            throw new AppError_1.AppError("Only the sitter can accept this booking", AppError_1.HttpCode.FORBIDDEN);
        }
        // Can only accept pending bookings
        if (booking.status !== "PENDING") {
            throw new AppError_1.AppError("Only pending bookings can be accepted", AppError_1.HttpCode.BAD_REQUEST);
        }
        const updated = await sitting_repository_1.SittingRepository.updateBookingStatus(bookingId, "ACCEPTED");
        return updated;
    }
    static async rejectBooking(userId, bookingId) {
        await this.ensureSitterAccessRequirements(userId);
        // Get booking
        const booking = await sitting_repository_1.SittingRepository.getSittingBookingById(bookingId);
        if (!booking) {
            throw new AppError_1.AppError("Booking not found", AppError_1.HttpCode.NOT_FOUND);
        }
        // Verify ownership
        if (booking.sitterId !== userId) {
            throw new AppError_1.AppError("Only the sitter can reject this booking", AppError_1.HttpCode.FORBIDDEN);
        }
        // Can only reject pending bookings
        if (booking.status !== "PENDING") {
            throw new AppError_1.AppError("Only pending bookings can be rejected", AppError_1.HttpCode.BAD_REQUEST);
        }
        const updated = await sitting_repository_1.SittingRepository.updateBookingStatus(bookingId, "REJECTED");
        return updated;
    }
    static async cancelBooking(userId, bookingId) {
        // Get booking
        const booking = await sitting_repository_1.SittingRepository.getSittingBookingById(bookingId);
        if (!booking) {
            throw new AppError_1.AppError("Booking not found", AppError_1.HttpCode.NOT_FOUND);
        }
        // Verify ownership - only owner can cancel
        if (booking.petOwnerId !== userId) {
            throw new AppError_1.AppError("Only the booking owner can cancel", AppError_1.HttpCode.FORBIDDEN);
        }
        // Can only cancel pending or accepted bookings
        if (!["PENDING", "ACCEPTED"].includes(booking.status)) {
            throw new AppError_1.AppError("Only pending or accepted bookings can be cancelled", AppError_1.HttpCode.BAD_REQUEST);
        }
        const updated = await sitting_repository_1.SittingRepository.updateBookingStatus(bookingId, "CANCELLED");
        return updated;
    }
    static async completeBooking(bookingId) {
        // Get booking
        const booking = await sitting_repository_1.SittingRepository.getSittingBookingById(bookingId);
        if (!booking) {
            throw new AppError_1.AppError("Booking not found", AppError_1.HttpCode.NOT_FOUND);
        }
        // Can only complete accepted bookings
        if (booking.status !== "ACCEPTED") {
            throw new AppError_1.AppError("Only accepted bookings can be completed", AppError_1.HttpCode.BAD_REQUEST);
        }
        const updated = await sitting_repository_1.SittingRepository.updateBookingStatus(bookingId, "COMPLETED");
        return updated;
    }
    // ─────────────────────────────────────────────────────────────────────────────
    // Sitter Review Operations
    // ─────────────────────────────────────────────────────────────────────────────
    static async createReview(userId, input) {
        // Get booking
        const booking = await sitting_repository_1.SittingRepository.getSittingBookingById(input.bookingId);
        if (!booking) {
            throw new AppError_1.AppError("Booking not found", AppError_1.HttpCode.NOT_FOUND);
        }
        // Verify booking is completed
        if (booking.status !== "COMPLETED") {
            throw new AppError_1.AppError("Only completed bookings can be reviewed", AppError_1.HttpCode.BAD_REQUEST);
        }
        // Verify ownership - only owner can review
        if (booking.petOwnerId !== userId) {
            throw new AppError_1.AppError("Only the booking owner can review", AppError_1.HttpCode.FORBIDDEN);
        }
        const review = await sitting_repository_1.SittingRepository.createSitterReview({
            bookingId: input.bookingId,
            sitterProfileId: booking.sitterProfileId,
            reviewerUserId: userId,
            rating: input.rating,
            ...(input.comment ? { comment: input.comment } : {}),
        });
        return review;
    }
    static async getSitterReviews(sitterId) {
        const profile = await sitting_repository_1.SittingRepository.getSitterProfileById(sitterId);
        if (!profile) {
            throw new AppError_1.AppError("Sitter not found", AppError_1.HttpCode.NOT_FOUND);
        }
        return sitting_repository_1.SittingRepository.getSitterReviews(profile.id);
    }
    // ─────────────────────────────────────────────────────────────────────────────
    // Search Operations
    // ─────────────────────────────────────────────────────────────────────────────
    static async searchSitters(filters) {
        return sitting_repository_1.SittingRepository.searchSitters(filters);
    }
    // ─────────────────────────────────────────────────────────────────────────────
    // Admin Operations
    // ─────────────────────────────────────────────────────────────────────────────
    static async getPendingSitters(page = 1, limit = 10) {
        return sitting_repository_1.SittingRepository.getPendingSitters(page, limit);
    }
    static async approveSitter(sitterId) {
        const profile = await sitting_repository_1.SittingRepository.getSitterProfileById(sitterId);
        if (!profile) {
            throw new AppError_1.AppError("Sitter not found", AppError_1.HttpCode.NOT_FOUND);
        }
        return sitting_repository_1.SittingRepository.approveSitterProfile(sitterId);
    }
    static async rejectSitter(sitterId) {
        const profile = await sitting_repository_1.SittingRepository.getSitterProfileById(sitterId);
        if (!profile) {
            throw new AppError_1.AppError("Sitter not found", AppError_1.HttpCode.NOT_FOUND);
        }
        return sitting_repository_1.SittingRepository.rejectSitterProfile(sitterId);
    }
}
exports.SittingService = SittingService;
//# sourceMappingURL=sitting.service.js.map