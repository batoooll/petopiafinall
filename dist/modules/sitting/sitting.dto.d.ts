import { z } from "zod";
export declare const MIN_SITTER_PLACE_PHOTOS = 2;
export declare const MIN_SITTER_PROFILE_PHOTOS = 1;
export declare const REQUIRED_ID_CARD_IMAGES = 2;
export declare const PaginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type PaginationInput = z.infer<typeof PaginationSchema>;
export declare const CreateSitterProfileSchema: z.ZodObject<{
    bio: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    supportedPetTypes: z.ZodArray<z.ZodString>;
    maxPets: z.ZodDefault<z.ZodNumber>;
    city: z.ZodString;
    address: z.ZodString;
    emergencyContact: z.ZodString;
}, z.core.$strip>;
export type CreateSitterProfileInput = z.infer<typeof CreateSitterProfileSchema>;
export declare const UpdateSitterProfileSchema: z.ZodObject<{
    bio: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    supportedPetTypes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    maxPets: z.ZodOptional<z.ZodNumber>;
    city: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    emergencyContact: z.ZodOptional<z.ZodString>;
    isAvailable: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type UpdateSitterProfileInput = z.infer<typeof UpdateSitterProfileSchema>;
export declare const UploadSitterImageSchema: z.ZodObject<{
    isPrimary: z.ZodDefault<z.ZodOptional<z.ZodCoercedBoolean<unknown>>>;
}, z.core.$strip>;
export type UploadSitterImageInput = z.infer<typeof UploadSitterImageSchema>;
export declare const UploadIdCardPhotoSchema: z.ZodObject<{
    photoNumber: z.ZodEnum<{
        1: "1";
        2: "2";
    }>;
}, z.core.$strip>;
export type UploadIdCardPhotoInput = z.infer<typeof UploadIdCardPhotoSchema>;
export declare const UploadLocationPhotoSchema: z.ZodObject<{
    photoNumber: z.ZodEnum<{
        1: "1";
        2: "2";
    }>;
}, z.core.$strip>;
export type UploadLocationPhotoInput = z.infer<typeof UploadLocationPhotoSchema>;
export declare const AddAvailabilitySchema: z.ZodObject<{
    startDate: z.ZodCoercedDate<unknown>;
    endDate: z.ZodCoercedDate<unknown>;
}, z.core.$strip>;
export type AddAvailabilityInput = z.infer<typeof AddAvailabilitySchema>;
export declare const DeleteAvailabilitySchema: z.ZodObject<{
    availabilityId: z.ZodString;
}, z.core.$strip>;
export declare const CreateSittingBookingSchema: z.ZodObject<{
    sitterId: z.ZodString;
    petId: z.ZodString;
    startDate: z.ZodCoercedDate<unknown>;
    endDate: z.ZodCoercedDate<unknown>;
    ownerNotes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    emergencyPhone: z.ZodString;
}, z.core.$strip>;
export type CreateSittingBookingInput = z.infer<typeof CreateSittingBookingSchema>;
export declare const CreateSitterReviewSchema: z.ZodObject<{
    bookingId: z.ZodString;
    rating: z.ZodNumber;
    comment: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export type CreateSitterReviewInput = z.infer<typeof CreateSitterReviewSchema>;
export declare const SearchSittersSchema: z.ZodObject<{
    city: z.ZodOptional<z.ZodString>;
    petType: z.ZodOptional<z.ZodString>;
    minRating: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    maxRating: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    startDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    endDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    sortBy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        rating: "rating";
        newest: "newest";
        booked: "booked";
    }>>>;
}, z.core.$strip>;
export type SearchSittersInput = z.infer<typeof SearchSittersSchema>;
//# sourceMappingURL=sitting.dto.d.ts.map