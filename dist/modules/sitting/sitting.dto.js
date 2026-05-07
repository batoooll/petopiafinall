"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchSittersSchema = exports.CreateSitterReviewSchema = exports.CreateSittingBookingSchema = exports.DeleteAvailabilitySchema = exports.AddAvailabilitySchema = exports.UploadLocationPhotoSchema = exports.UploadIdCardPhotoSchema = exports.UploadSitterImageSchema = exports.UpdateSitterProfileSchema = exports.CreateSitterProfileSchema = exports.PaginationSchema = exports.REQUIRED_ID_CARD_IMAGES = exports.MIN_SITTER_PROFILE_PHOTOS = exports.MIN_SITTER_PLACE_PHOTOS = void 0;
const zod_1 = require("zod");
exports.MIN_SITTER_PLACE_PHOTOS = 2;
exports.MIN_SITTER_PROFILE_PHOTOS = 1;
exports.REQUIRED_ID_CARD_IMAGES = 2;
// ─────────────────────────────────────────────
// Pagination
// ─────────────────────────────────────────────
exports.PaginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(50).default(10),
});
// ─────────────────────────────────────────────
// Sitter Profile
// ─────────────────────────────────────────────
exports.CreateSitterProfileSchema = zod_1.z.object({
    bio: zod_1.z.string().max(1000).optional().nullable(),
    supportedPetTypes: zod_1.z.array(zod_1.z.string()).min(1),
    maxPets: zod_1.z.number().int().min(1).max(20).default(3),
    city: zod_1.z.string().min(1),
    address: zod_1.z.string().min(5),
    emergencyContact: zod_1.z.string().min(10),
});
exports.UpdateSitterProfileSchema = zod_1.z.object({
    bio: zod_1.z.string().max(1000).optional().nullable(),
    supportedPetTypes: zod_1.z.array(zod_1.z.string()).optional(),
    maxPets: zod_1.z.number().int().min(1).max(20).optional(),
    city: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    emergencyContact: zod_1.z.string().optional(),
    isAvailable: zod_1.z.boolean().optional(),
});
// ─────────────────────────────────────────────
// Image
// ─────────────────────────────────────────────
exports.UploadSitterImageSchema = zod_1.z.object({
    isPrimary: zod_1.z.coerce.boolean().optional().default(false),
});
// ─────────────────────────────────────────────
// Verification Photos (PetOwner for PetSitter)
// ─────────────────────────────────────────────
exports.UploadIdCardPhotoSchema = zod_1.z.object({
    photoNumber: zod_1.z.enum(["1", "2"]).describe("Which ID card photo (1 or 2)"),
});
exports.UploadLocationPhotoSchema = zod_1.z.object({
    photoNumber: zod_1.z.enum(["1", "2"]).describe("Which location photo (1 or 2)"),
});
// ─────────────────────────────────────────────
// Availability
// ─────────────────────────────────────────────
exports.AddAvailabilitySchema = zod_1.z.object({
    startDate: zod_1.z.coerce.date().refine(d => d > new Date(), "Must be future"),
    endDate: zod_1.z.coerce.date(),
}).refine(d => d.endDate > d.startDate, {
    message: "End date must be after start date",
});
exports.DeleteAvailabilitySchema = zod_1.z.object({
    availabilityId: zod_1.z.string().cuid(),
});
// ─────────────────────────────────────────────
// Booking
// ─────────────────────────────────────────────
exports.CreateSittingBookingSchema = zod_1.z.object({
    sitterId: zod_1.z.string().cuid(),
    petId: zod_1.z.string().cuid(),
    startDate: zod_1.z.coerce.date(),
    endDate: zod_1.z.coerce.date(),
    ownerNotes: zod_1.z.string().optional().nullable(),
    emergencyPhone: zod_1.z.string().min(10),
}).refine(d => d.endDate > d.startDate, {
    message: "End date must be after start date",
});
// ─────────────────────────────────────────────
// Review
// ─────────────────────────────────────────────
exports.CreateSitterReviewSchema = zod_1.z.object({
    bookingId: zod_1.z.string().cuid(),
    rating: zod_1.z.number().int().min(1).max(5),
    comment: zod_1.z.string().optional().nullable(),
});
// ─────────────────────────────────────────────
// Search
// ─────────────────────────────────────────────
exports.SearchSittersSchema = zod_1.z.object({
    city: zod_1.z.string().optional(),
    petType: zod_1.z.string().optional(),
    minRating: zod_1.z.coerce.number().min(0).max(5).optional(),
    maxRating: zod_1.z.coerce.number().min(0).max(5).optional(),
    startDate: zod_1.z.coerce.date().optional(),
    endDate: zod_1.z.coerce.date().optional(),
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(10),
    sortBy: zod_1.z.enum(["rating", "newest", "booked"]).optional().default("rating"),
});
//# sourceMappingURL=sitting.dto.js.map