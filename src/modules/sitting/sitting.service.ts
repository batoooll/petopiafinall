import prisma from "../../config/prisma";
import { AppError, HttpCode } from "../../common/errors/AppError";
import { SittingRepository } from "./sitting.repository";
import { storageClient } from "../../integrations/storage/index";
import {
  CreateSitterProfileInput,
  UpdateSitterProfileInput,
  UploadSitterImageInput,
  MIN_SITTER_PLACE_PHOTOS,
  MIN_SITTER_PROFILE_PHOTOS,
  REQUIRED_ID_CARD_IMAGES,
  AddAvailabilityInput,
  CreateSittingBookingInput,
  CreateSitterReviewInput,
  SearchSittersInput,
  UploadIdCardPhotoInput,
  UploadLocationPhotoInput,
} from "./sitting.dto";
import { SitterProfileData, SearchSittersFilters } from "./sitting.types";
import { SitterProfile } from "../../../generated/prisma";

export class SittingService {
  private static async getOwnerAndSitterProfile(userId: string) {
    const [ownerProfile, sitterProfile] = await Promise.all([
      prisma.petOwnerProfile.findUnique({ where: { userId } }),
      SittingRepository.getSitterProfileByUserId(userId),
    ]);

    return { ownerProfile, sitterProfile };
  }

  private static hasRequiredIdCardImages(ownerProfile: {
    idCardPhoto1: string | null;
    idCardPhoto2: string | null;
  }): boolean {
    return Boolean(ownerProfile.idCardPhoto1 && ownerProfile.idCardPhoto2);
  }

  private static async hasRequiredSitterPhotos(
    sitterProfileId: string,
    ownerHasProfilePhoto: boolean
  ) {
    const images = await SittingRepository.getSitterImages(sitterProfileId);
    const profilePhotosCount = images.filter((image) => image.isPrimary).length;
    const placePhotosCount = images.length;

    return {
      profilePhotosCount,
      placePhotosCount,
      hasProfilePhoto:
        ownerHasProfilePhoto || profilePhotosCount >= MIN_SITTER_PROFILE_PHOTOS,
      hasMinPlacePhotos: placePhotosCount >= MIN_SITTER_PLACE_PHOTOS,
    };
  }

  private static async ensureSitterAccessRequirements(
    userId: string,
    overrideSitterProfileId?: string
  ) {
    const { ownerProfile, sitterProfile } = await this.getOwnerAndSitterProfile(userId);
    const sitterProfileId = overrideSitterProfileId ?? sitterProfile?.id;

    if (!ownerProfile) {
      throw new AppError(
        "Pet owner profile not found. Please create one first.",
        HttpCode.NOT_FOUND
      );
    }

    if (!this.hasRequiredIdCardImages(ownerProfile)) {
      throw new AppError(
        `Exactly ${REQUIRED_ID_CARD_IMAGES} ID card images are required before using sitter services`,
        HttpCode.BAD_REQUEST
      );
    }

    if (!sitterProfileId) {
      throw new AppError(
        "Sitter profile not found. Please create one first.",
        HttpCode.NOT_FOUND
      );
    }

    const ownerHasProfilePhoto = Boolean((ownerProfile as any).profilePhoto);
    const photoState = await this.hasRequiredSitterPhotos(
      sitterProfileId,
      ownerHasProfilePhoto
    );

    if (!photoState.hasProfilePhoto) {
      throw new AppError(
        "A profile photo is required before enabling sitter profile or using sitter services",
        HttpCode.BAD_REQUEST
      );
    }

    if (!photoState.hasMinPlacePhotos) {
      throw new AppError(
        `At least ${MIN_SITTER_PLACE_PHOTOS} place photos are required before enabling sitter profile or using sitter services`,
        HttpCode.BAD_REQUEST
      );
    }

    return { ownerProfile, sitterProfileId, photoState };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Sitter Profile Operations
  // ─────────────────────────────────────────────────────────────────────────────

  static async createSitterProfile(
    userId: string,
    input: CreateSitterProfileInput
  ) {
    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError("User not found", HttpCode.NOT_FOUND);
    }

    // Get pet owner profile
    const ownerProfile = await prisma.petOwnerProfile.findUnique({
      where: { userId },
    });

    if (!ownerProfile) {
      throw new AppError(
        "Pet owner profile not found. Please create one first.",
        HttpCode.NOT_FOUND
      );
    }

    // REQUIREMENT: Exactly 2 ID card images are mandatory.
    if (!this.hasRequiredIdCardImages(ownerProfile)) {
      throw new AppError(
        `Exactly ${REQUIRED_ID_CARD_IMAGES} ID card images are required before creating a sitter profile`,
        HttpCode.BAD_REQUEST
      );
    }

    const profile = await SittingRepository.createSitterProfile({
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

    const ownerProfilePhoto = (ownerProfile as any).profilePhoto as
      | string
      | undefined;
    if (ownerProfilePhoto) {
      const existingImages = await SittingRepository.getSitterImages(profile.id);
      const hasPrimaryImage = existingImages.some((image) => image.isPrimary);

      if (!hasPrimaryImage) {
        await SittingRepository.createSitterImage({
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

  static async getSitterProfileMe(userId: string) {
    const profile = await SittingRepository.getSitterProfileByUserId(userId);

    if (!profile) {
      throw new AppError(
        "Sitter profile not found. Please create one first.",
        HttpCode.NOT_FOUND
      );
    }

    return profile;
  }

  static async getSitterProfile(sitterId: string) {
    const profile = await SittingRepository.getSitterProfileById(sitterId);

    if (!profile) {
      throw new AppError("Sitter profile not found", HttpCode.NOT_FOUND);
    }

    return profile;
  }

  static async updateSitterProfile(
    userId: string,
    input: UpdateSitterProfileInput
  ) {
    // Verify profile exists
    const profile = await SittingRepository.getSitterProfileByUserId(userId);

    if (!profile) {
      throw new AppError(
        "Sitter profile not found. Please create one first.",
        HttpCode.NOT_FOUND
      );
    }

    // REQUIREMENT: enforce full sitter access requirements before activating.
    if (input.isAvailable === true) {
      await this.ensureSitterAccessRequirements(userId, profile.id);
    }

    const updated = await SittingRepository.updateSitterProfile(userId, input as Partial<SitterProfileData>);

    return updated;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Sitter Image Operations
  // ─────────────────────────────────────────────────────────────────────────────

  static async uploadSitterImage(
    userId: string,
    file: Express.Multer.File,
    input: UploadSitterImageInput
  ) {
    if (!file) {
      throw new AppError("No file provided", HttpCode.BAD_REQUEST);
    }

    // Verify profile exists
    const profile = await SittingRepository.getSitterProfileByUserId(userId);

    if (!profile) {
      throw new AppError(
        "Sitter profile not found. Please create one first.",
        HttpCode.NOT_FOUND
      );
    }

    // Validate file is an image
    if (!file.mimetype.startsWith("image/")) {
      throw new AppError(
        "Only image files are allowed",
        HttpCode.BAD_REQUEST
      );
    }

    // Upload file using storage client
    const uploadResult = await storageClient.upload(
      file.buffer,
      file.originalname,
      `sitter-images/${profile.id}`,
      { mimeType: file.mimetype }
    );

    // Save image metadata to database
    const image = await SittingRepository.createSitterImage({
      sitterProfileId: profile.id,
      imageUrl: uploadResult.url,
      storageKey: uploadResult.storageKey,
      uploadedById: userId,
      isPrimary: input.isPrimary,
    });

    return image;
  }

  static async getSitterImages(userId: string) {
    const profile = await SittingRepository.getSitterProfileByUserId(userId);

    if (!profile) {
      throw new AppError(
        "Sitter profile not found",
        HttpCode.NOT_FOUND
      );
    }

    return SittingRepository.getSitterImages(profile.id);
  }

  static async deleteSitterImage(userId: string, imageId: string) {
    // Verify profile exists
    const profile = await SittingRepository.getSitterProfileByUserId(userId);

    if (!profile) {
      throw new AppError(
        "Sitter profile not found",
        HttpCode.NOT_FOUND
      );
    }

    // Verify image belongs to this sitter
    const image = await prisma.sitterImage.findUnique({
      where: { id: imageId },
    });

    if (!image || image.sitterProfileId !== profile.id) {
      throw new AppError(
        "Image not found or does not belong to your profile",
        HttpCode.NOT_FOUND
      );
    }

    // Keep active sitters compliant with minimum place photos.
    if (profile.isAvailable) {
      const images = await SittingRepository.getSitterImages(profile.id);
      const remainingImages = images.filter((img) => img.id !== imageId);
      const ownerProfile = await prisma.petOwnerProfile.findUnique({
        where: { userId },
      });
      const ownerHasProfilePhoto = Boolean((ownerProfile as any)?.profilePhoto);
      const hasProfilePhotoAfterDelete =
        ownerHasProfilePhoto ||
        remainingImages.some((remainingImage) => remainingImage.isPrimary);

      if (remainingImages.length < MIN_SITTER_PLACE_PHOTOS) {
        throw new AppError(
          `Active sitters must keep at least ${MIN_SITTER_PLACE_PHOTOS} place photos`,
          HttpCode.BAD_REQUEST
        );
      }

      if (!hasProfilePhotoAfterDelete) {
        throw new AppError(
          "Active sitters must keep a profile photo",
          HttpCode.BAD_REQUEST
        );
      }
    }

    // Delete file from storage unless image was reused from owner profile.
    if (!image.storageKey.startsWith("owner-profile-reuse:")) {
      await storageClient.delete(image.storageKey);
    }

    // Delete image record from database
    await SittingRepository.deleteSitterImage(imageId);

    return { message: "Image deleted successfully" };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Pet Owner Verification Photos (Shared with Sitter Profile)
  // ─────────────────────────────────────────────────────────────────────────────

  static async uploadIdCardPhoto(
    userId: string,
    file: Express.Multer.File,
    input: UploadIdCardPhotoInput
  ) {
    if (!file) {
      throw new AppError("No file provided", HttpCode.BAD_REQUEST);
    }

    // Validate file is an image
    if (!file.mimetype.startsWith("image/")) {
      throw new AppError(
        "Only image files are allowed",
        HttpCode.BAD_REQUEST
      );
    }

    // Get or create pet owner profile
    let ownerProfile = await prisma.petOwnerProfile.findUnique({
      where: { userId },
    });

    if (!ownerProfile) {
      throw new AppError(
        "Pet owner profile not found. Please create one first.",
        HttpCode.NOT_FOUND
      );
    }

    // Upload file using storage client
    const uploadResult = await storageClient.upload(
      file.buffer,
      file.originalname,
      `owner-verification/id-cards/${ownerProfile.id}`,
      { mimeType: file.mimetype }
    );

    // Update pet owner profile with ID card photo
    const fieldName = input.photoNumber === "1" ? "idCardPhoto1" : "idCardPhoto2";
    const updated = await prisma.petOwnerProfile.update({
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

  static async uploadLocationPhoto(
    userId: string,
    file: Express.Multer.File,
    input: UploadLocationPhotoInput
  ) {
    if (!file) {
      throw new AppError("No file provided", HttpCode.BAD_REQUEST);
    }

    // Validate file is an image
    if (!file.mimetype.startsWith("image/")) {
      throw new AppError(
        "Only image files are allowed",
        HttpCode.BAD_REQUEST
      );
    }

    // Get pet owner profile
    let ownerProfile = await prisma.petOwnerProfile.findUnique({
      where: { userId },
    });

    if (!ownerProfile) {
      throw new AppError(
        "Pet owner profile not found. Please create one first.",
        HttpCode.NOT_FOUND
      );
    }

    // Upload file using storage client
    const uploadResult = await storageClient.upload(
      file.buffer,
      file.originalname,
      `owner-verification/locations/${ownerProfile.id}`,
      { mimeType: file.mimetype }
    );

    // Update pet owner profile with location photo
    const fieldName = input.photoNumber === "1" ? "locationPhoto1" : "locationPhoto2";
    const updated = await prisma.petOwnerProfile.update({
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

  static async getVerificationPhotos(userId: string) {
    const ownerProfile = await prisma.petOwnerProfile.findUnique({
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
      throw new AppError(
        "Pet owner profile not found",
        HttpCode.NOT_FOUND
      );
    }

    return ownerProfile;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Sitter Availability Operations
  // ─────────────────────────────────────────────────────────────────────────────

  static async addAvailability(userId: string, input: AddAvailabilityInput) {
    // Verify profile exists
    const profile = await SittingRepository.getSitterProfileByUserId(userId);

    if (!profile) {
      throw new AppError(
        "Sitter profile not found. Please create one first.",
        HttpCode.NOT_FOUND
      );
    }

    await this.ensureSitterAccessRequirements(userId, profile.id);

    const availability = await SittingRepository.addAvailability({
      sitterProfileId: profile.id,
      userId,
      startDate: input.startDate,
      endDate: input.endDate,
    });

    return availability;
  }

  static async getMyAvailability(userId: string) {
    const profile = await SittingRepository.getSitterProfileByUserId(userId);

    if (!profile) {
      throw new AppError(
        "Sitter profile not found",
        HttpCode.NOT_FOUND
      );
    }

    await this.ensureSitterAccessRequirements(userId, profile.id);

    return SittingRepository.getSitterAvailability(profile.id);
  }

  static async deleteAvailability(userId: string, availabilityId: string) {
    // Verify profile exists
    const profile = await SittingRepository.getSitterProfileByUserId(userId);

    if (!profile) {
      throw new AppError(
        "Sitter profile not found",
        HttpCode.NOT_FOUND
      );
    }

    // Verify availability belongs to this sitter
    const availability = await prisma.sitterAvailability.findUnique({
      where: { id: availabilityId },
    });

    if (!availability || availability.sitterProfileId !== profile.id) {
      throw new AppError(
        "Availability not found or does not belong to your profile",
        HttpCode.NOT_FOUND
      );
    }

    await SittingRepository.deleteAvailability(availabilityId);

    return { message: "Availability deleted successfully" };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Sitting Booking Operations
  // ─────────────────────────────────────────────────────────────────────────────

  static async createBooking(userId: string, input: CreateSittingBookingInput) {
    // Verify pet ownership
    const pet = await prisma.pet.findUnique({
      where: { id: input.petId },
      select: { ownerId: true },
    });

    if (!pet || pet.ownerId !== userId) {
      throw new AppError(
        "Pet not found or does not belong to you",
        HttpCode.NOT_FOUND
      );
    }

    // Verify sitter exists and is approved
    const sitterProfile = await SittingRepository.getSitterProfileById(
      input.sitterId
    );

    if (!sitterProfile) {
      throw new AppError("Sitter not found", HttpCode.NOT_FOUND);
    }

    // REQUIREMENT: Only APPROVED sitters can receive bookings
    if (sitterProfile.verificationStatus !== "APPROVED") {
      throw new AppError(
        "This sitter is not approved to receive bookings",
        HttpCode.BAD_REQUEST
      );
    }

    // REQUIREMENT: Sitter must be marked as available
    if (!sitterProfile.isAvailable) {
      throw new AppError(
        "Sitter is not currently available",
        HttpCode.BAD_REQUEST
      );
    }

    await this.ensureSitterAccessRequirements(sitterProfile.userId, sitterProfile.id);

    // Cannot book own profile
    if (sitterProfile.userId === userId) {
      throw new AppError(
        "You cannot book your own sitter profile",
        HttpCode.BAD_REQUEST
      );
    }

    // Check if sitter is available
    const isAvailable = await SittingRepository.checkAvailability(
      sitterProfile.id,
      input.startDate,
      input.endDate
    );

    if (!isAvailable) {
      throw new AppError(
        "Sitter is not available for the requested dates",
        HttpCode.BAD_REQUEST
      );
    }

    // REQUIREMENT: Enforce pet limit constraint (max 3 pets at same time)
    const overlappingBookings = await SittingRepository.countOverlappingAcceptedBookings(
      sitterProfile.id,
      input.startDate,
      input.endDate
    );

    if (overlappingBookings >= 3) {
      throw new AppError(
        "Sitter has reached maximum pet capacity for this date range",
        HttpCode.BAD_REQUEST
      );
    }

    // Create booking
    const totalDays = Math.ceil(
      (input.endDate.getTime() - input.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const booking = await SittingRepository.createSittingBooking({
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

  static async getMyBookingsAsSitter(
    userId: string,
    page: number = 1,
    limit: number = 10
  ) {
    await this.ensureSitterAccessRequirements(userId);
    return SittingRepository.getSitterBookings(userId, undefined, page, limit);
  }

  static async getIncomingBookingsAsSitter(
    userId: string,
    page: number = 1,
    limit: number = 10
  ) {
    await this.ensureSitterAccessRequirements(userId);
    const { bookings, total } = await SittingRepository.getSitterBookings(
      userId,
      "PENDING",
      page,
      limit
    );

    return { bookings, total };
  }

  static async getMyBookingsAsOwner(
    userId: string,
    page: number = 1,
    limit: number = 10
  ) {
    return SittingRepository.getOwnerBookings(userId, undefined, page, limit);
  }

  static async acceptBooking(userId: string, bookingId: string) {
    await this.ensureSitterAccessRequirements(userId);

    // Get booking
    const booking = await SittingRepository.getSittingBookingById(bookingId);

    if (!booking) {
      throw new AppError("Booking not found", HttpCode.NOT_FOUND);
    }

    // Verify ownership
    if (booking.sitterId !== userId) {
      throw new AppError(
        "Only the sitter can accept this booking",
        HttpCode.FORBIDDEN
      );
    }

    // Can only accept pending bookings
    if (booking.status !== "PENDING") {
      throw new AppError(
        "Only pending bookings can be accepted",
        HttpCode.BAD_REQUEST
      );
    }

    const updated = await SittingRepository.updateBookingStatus(
      bookingId,
      "ACCEPTED"
    );

    return updated;
  }

  static async rejectBooking(userId: string, bookingId: string) {
    await this.ensureSitterAccessRequirements(userId);

    // Get booking
    const booking = await SittingRepository.getSittingBookingById(bookingId);

    if (!booking) {
      throw new AppError("Booking not found", HttpCode.NOT_FOUND);
    }

    // Verify ownership
    if (booking.sitterId !== userId) {
      throw new AppError(
        "Only the sitter can reject this booking",
        HttpCode.FORBIDDEN
      );
    }

    // Can only reject pending bookings
    if (booking.status !== "PENDING") {
      throw new AppError(
        "Only pending bookings can be rejected",
        HttpCode.BAD_REQUEST
      );
    }

    const updated = await SittingRepository.updateBookingStatus(
      bookingId,
      "REJECTED"
    );

    return updated;
  }

  static async cancelBooking(userId: string, bookingId: string) {
    // Get booking
    const booking = await SittingRepository.getSittingBookingById(bookingId);

    if (!booking) {
      throw new AppError("Booking not found", HttpCode.NOT_FOUND);
    }

    // Verify ownership - only owner can cancel
    if (booking.petOwnerId !== userId) {
      throw new AppError(
        "Only the booking owner can cancel",
        HttpCode.FORBIDDEN
      );
    }

    // Can only cancel pending or accepted bookings
    if (!["PENDING", "ACCEPTED"].includes(booking.status)) {
      throw new AppError(
        "Only pending or accepted bookings can be cancelled",
        HttpCode.BAD_REQUEST
      );
    }

    const updated = await SittingRepository.updateBookingStatus(
      bookingId,
      "CANCELLED"
    );

    return updated;
  }

  static async completeBooking(bookingId: string) {
    // Get booking
    const booking = await SittingRepository.getSittingBookingById(bookingId);

    if (!booking) {
      throw new AppError("Booking not found", HttpCode.NOT_FOUND);
    }

    // Can only complete accepted bookings
    if (booking.status !== "ACCEPTED") {
      throw new AppError(
        "Only accepted bookings can be completed",
        HttpCode.BAD_REQUEST
      );
    }

    const updated = await SittingRepository.updateBookingStatus(
      bookingId,
      "COMPLETED"
    );

    return updated;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Sitter Review Operations
  // ─────────────────────────────────────────────────────────────────────────────

  static async createReview(
    userId: string,
    input: CreateSitterReviewInput
  ) {
    // Get booking
    const booking = await SittingRepository.getSittingBookingById(
      input.bookingId
    );

    if (!booking) {
      throw new AppError("Booking not found", HttpCode.NOT_FOUND);
    }

    // Verify booking is completed
    if (booking.status !== "COMPLETED") {
      throw new AppError(
        "Only completed bookings can be reviewed",
        HttpCode.BAD_REQUEST
      );
    }

    // Verify ownership - only owner can review
    if (booking.petOwnerId !== userId) {
      throw new AppError(
        "Only the booking owner can review",
        HttpCode.FORBIDDEN
      );
    }

    const review = await SittingRepository.createSitterReview({
      bookingId: input.bookingId,
      sitterProfileId: booking.sitterProfileId,
      reviewerUserId: userId,
      rating: input.rating,
      ...(input.comment ? { comment: input.comment } : {}),
    });

    return review;
  }

  static async getSitterReviews(sitterId: string) {
    const profile = await SittingRepository.getSitterProfileById(sitterId);

    if (!profile) {
      throw new AppError("Sitter not found", HttpCode.NOT_FOUND);
    }

    return SittingRepository.getSitterReviews(profile.id);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Search Operations
  // ─────────────────────────────────────────────────────────────────────────────

  static async searchSitters(filters: SearchSittersInput): Promise<{ sitters: SitterProfile[]; total: number }> {
    return SittingRepository.searchSitters(filters as SearchSittersFilters);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Admin Operations
  // ─────────────────────────────────────────────────────────────────────────────

  static async getPendingSitters(page: number = 1, limit: number = 10) {
    return SittingRepository.getPendingSitters(page, limit);
  }

  static async approveSitter(sitterId: string) {
    const profile = await SittingRepository.getSitterProfileById(sitterId);

    if (!profile) {
      throw new AppError("Sitter not found", HttpCode.NOT_FOUND);
    }

    return SittingRepository.approveSitterProfile(sitterId);
  }

  static async rejectSitter(sitterId: string) {
    const profile = await SittingRepository.getSitterProfileById(sitterId);

    if (!profile) {
      throw new AppError("Sitter not found", HttpCode.NOT_FOUND);
    }

    return SittingRepository.rejectSitterProfile(sitterId);
  }
}
