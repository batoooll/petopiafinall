import { CreateSitterProfileInput, UpdateSitterProfileInput, UploadSitterImageInput, AddAvailabilityInput, CreateSittingBookingInput, CreateSitterReviewInput, SearchSittersInput, UploadIdCardPhotoInput, UploadLocationPhotoInput } from "./sitting.dto";
import { SitterProfile } from "../../../generated/prisma";
export declare class SittingService {
    private static getOwnerAndSitterProfile;
    private static hasRequiredIdCardImages;
    private static hasRequiredSitterPhotos;
    private static ensureSitterAccessRequirements;
    static createSitterProfile(userId: string, input: CreateSitterProfileInput): Promise<{
        id: string;
        createdAt: Date;
        address: string;
        verificationStatus: import("../../../generated/prisma").$Enums.SitterVerificationStatus;
        userId: string;
        updatedAt: Date;
        petOwnerProfileId: string;
        bio: string | null;
        supportedPetTypes: string[];
        maxPets: number;
        city: string;
        emergencyContact: string;
        isAvailable: boolean;
        ratingAverage: number;
        totalReviews: number;
    }>;
    static getSitterProfileMe(userId: string): Promise<{
        id: string;
        createdAt: Date;
        address: string;
        verificationStatus: import("../../../generated/prisma").$Enums.SitterVerificationStatus;
        userId: string;
        updatedAt: Date;
        petOwnerProfileId: string;
        bio: string | null;
        supportedPetTypes: string[];
        maxPets: number;
        city: string;
        emergencyContact: string;
        isAvailable: boolean;
        ratingAverage: number;
        totalReviews: number;
    }>;
    static getSitterProfile(sitterId: string): Promise<{
        id: string;
        createdAt: Date;
        address: string;
        verificationStatus: import("../../../generated/prisma").$Enums.SitterVerificationStatus;
        userId: string;
        updatedAt: Date;
        petOwnerProfileId: string;
        bio: string | null;
        supportedPetTypes: string[];
        maxPets: number;
        city: string;
        emergencyContact: string;
        isAvailable: boolean;
        ratingAverage: number;
        totalReviews: number;
    }>;
    static updateSitterProfile(userId: string, input: UpdateSitterProfileInput): Promise<{
        id: string;
        createdAt: Date;
        address: string;
        verificationStatus: import("../../../generated/prisma").$Enums.SitterVerificationStatus;
        userId: string;
        updatedAt: Date;
        petOwnerProfileId: string;
        bio: string | null;
        supportedPetTypes: string[];
        maxPets: number;
        city: string;
        emergencyContact: string;
        isAvailable: boolean;
        ratingAverage: number;
        totalReviews: number;
    }>;
    static uploadSitterImage(userId: string, file: Express.Multer.File, input: UploadSitterImageInput): Promise<{
        id: string;
        createdAt: Date;
        storageKey: string;
        uploadedById: string | null;
        sitterProfileId: string;
        imageUrl: string;
        isPrimary: boolean;
    }>;
    static getSitterImages(userId: string): Promise<{
        id: string;
        createdAt: Date;
        storageKey: string;
        uploadedById: string | null;
        sitterProfileId: string;
        imageUrl: string;
        isPrimary: boolean;
    }[]>;
    static deleteSitterImage(userId: string, imageId: string): Promise<{
        message: string;
    }>;
    static uploadIdCardPhoto(userId: string, file: Express.Multer.File, input: UploadIdCardPhotoInput): Promise<{
        photoNumber: "1" | "2";
        url: string;
        message: string;
        data: {
            sitterProfile: {
                id: string;
                createdAt: Date;
                address: string;
                verificationStatus: import("../../../generated/prisma").$Enums.SitterVerificationStatus;
                userId: string;
                updatedAt: Date;
                petOwnerProfileId: string;
                bio: string | null;
                supportedPetTypes: string[];
                maxPets: number;
                city: string;
                emergencyContact: string;
                isAvailable: boolean;
                ratingAverage: number;
                totalReviews: number;
            } | null;
        } & {
            id: string;
            phone: string;
            address: string | null;
            idCardPhoto1: string | null;
            idCardPhoto2: string | null;
            locationPhoto1: string | null;
            locationPhoto2: string | null;
            verificationStatus: import("../../../generated/prisma").$Enums.SitterVerificationStatus;
            userId: string;
        };
    }>;
    static uploadLocationPhoto(userId: string, file: Express.Multer.File, input: UploadLocationPhotoInput): Promise<{
        photoNumber: "1" | "2";
        url: string;
        message: string;
        data: {
            sitterProfile: {
                id: string;
                createdAt: Date;
                address: string;
                verificationStatus: import("../../../generated/prisma").$Enums.SitterVerificationStatus;
                userId: string;
                updatedAt: Date;
                petOwnerProfileId: string;
                bio: string | null;
                supportedPetTypes: string[];
                maxPets: number;
                city: string;
                emergencyContact: string;
                isAvailable: boolean;
                ratingAverage: number;
                totalReviews: number;
            } | null;
        } & {
            id: string;
            phone: string;
            address: string | null;
            idCardPhoto1: string | null;
            idCardPhoto2: string | null;
            locationPhoto1: string | null;
            locationPhoto2: string | null;
            verificationStatus: import("../../../generated/prisma").$Enums.SitterVerificationStatus;
            userId: string;
        };
    }>;
    static getVerificationPhotos(userId: string): Promise<{
        id: string;
        sitterProfile: {
            id: string;
            verificationStatus: import("../../../generated/prisma").$Enums.SitterVerificationStatus;
        } | null;
        idCardPhoto1: string | null;
        idCardPhoto2: string | null;
        locationPhoto1: string | null;
        locationPhoto2: string | null;
        verificationStatus: import("../../../generated/prisma").$Enums.SitterVerificationStatus;
    }>;
    static addAvailability(userId: string, input: AddAvailabilityInput): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        sitterProfileId: string;
        startDate: Date;
        endDate: Date;
    }>;
    static getMyAvailability(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        sitterProfileId: string;
        startDate: Date;
        endDate: Date;
    }[]>;
    static deleteAvailability(userId: string, availabilityId: string): Promise<{
        message: string;
    }>;
    static createBooking(userId: string, input: CreateSittingBookingInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../../generated/prisma").$Enums.SittingBookingStatus;
        petId: string;
        sitterProfileId: string;
        sitterId: string;
        petOwnerId: string;
        startDate: Date;
        endDate: Date;
        totalDays: number;
        ownerNotes: string | null;
        emergencyPhone: string;
    }>;
    static getMyBookingsAsSitter(userId: string, page?: number, limit?: number): Promise<{
        bookings: ({
            pet: {
                id: string;
                name: string;
                breed: string | null;
            };
            petOwner: {
                id: string;
                email: string;
                fullName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("../../../generated/prisma").$Enums.SittingBookingStatus;
            petId: string;
            sitterProfileId: string;
            sitterId: string;
            petOwnerId: string;
            startDate: Date;
            endDate: Date;
            totalDays: number;
            ownerNotes: string | null;
            emergencyPhone: string;
        })[];
        total: number;
    }>;
    static getIncomingBookingsAsSitter(userId: string, page?: number, limit?: number): Promise<{
        bookings: ({
            pet: {
                id: string;
                name: string;
                breed: string | null;
            };
            petOwner: {
                id: string;
                email: string;
                fullName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("../../../generated/prisma").$Enums.SittingBookingStatus;
            petId: string;
            sitterProfileId: string;
            sitterId: string;
            petOwnerId: string;
            startDate: Date;
            endDate: Date;
            totalDays: number;
            ownerNotes: string | null;
            emergencyPhone: string;
        })[];
        total: number;
    }>;
    static getMyBookingsAsOwner(userId: string, page?: number, limit?: number): Promise<{
        bookings: ({
            sitterProfile: {
                user: {
                    id: string;
                    email: string;
                    fullName: string;
                };
            } & {
                id: string;
                createdAt: Date;
                address: string;
                verificationStatus: import("../../../generated/prisma").$Enums.SitterVerificationStatus;
                userId: string;
                updatedAt: Date;
                petOwnerProfileId: string;
                bio: string | null;
                supportedPetTypes: string[];
                maxPets: number;
                city: string;
                emergencyContact: string;
                isAvailable: boolean;
                ratingAverage: number;
                totalReviews: number;
            };
            pet: {
                id: string;
                name: string;
                breed: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("../../../generated/prisma").$Enums.SittingBookingStatus;
            petId: string;
            sitterProfileId: string;
            sitterId: string;
            petOwnerId: string;
            startDate: Date;
            endDate: Date;
            totalDays: number;
            ownerNotes: string | null;
            emergencyPhone: string;
        })[];
        total: number;
    }>;
    static acceptBooking(userId: string, bookingId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../../generated/prisma").$Enums.SittingBookingStatus;
        petId: string;
        sitterProfileId: string;
        sitterId: string;
        petOwnerId: string;
        startDate: Date;
        endDate: Date;
        totalDays: number;
        ownerNotes: string | null;
        emergencyPhone: string;
    }>;
    static rejectBooking(userId: string, bookingId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../../generated/prisma").$Enums.SittingBookingStatus;
        petId: string;
        sitterProfileId: string;
        sitterId: string;
        petOwnerId: string;
        startDate: Date;
        endDate: Date;
        totalDays: number;
        ownerNotes: string | null;
        emergencyPhone: string;
    }>;
    static cancelBooking(userId: string, bookingId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../../generated/prisma").$Enums.SittingBookingStatus;
        petId: string;
        sitterProfileId: string;
        sitterId: string;
        petOwnerId: string;
        startDate: Date;
        endDate: Date;
        totalDays: number;
        ownerNotes: string | null;
        emergencyPhone: string;
    }>;
    static completeBooking(bookingId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../../generated/prisma").$Enums.SittingBookingStatus;
        petId: string;
        sitterProfileId: string;
        sitterId: string;
        petOwnerId: string;
        startDate: Date;
        endDate: Date;
        totalDays: number;
        ownerNotes: string | null;
        emergencyPhone: string;
    }>;
    static createReview(userId: string, input: CreateSitterReviewInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sitterProfileId: string;
        bookingId: string;
        reviewerUserId: string;
        rating: number;
        comment: string | null;
    }>;
    static getSitterReviews(sitterId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sitterProfileId: string;
        bookingId: string;
        reviewerUserId: string;
        rating: number;
        comment: string | null;
    }[]>;
    static searchSitters(filters: SearchSittersInput): Promise<{
        sitters: SitterProfile[];
        total: number;
    }>;
    static getPendingSitters(page?: number, limit?: number): Promise<{
        sitters: ({
            user: {
                id: string;
                email: string;
                fullName: string;
            };
            images: {
                id: string;
                createdAt: Date;
                storageKey: string;
                uploadedById: string | null;
                sitterProfileId: string;
                imageUrl: string;
                isPrimary: boolean;
            }[];
        } & {
            id: string;
            createdAt: Date;
            address: string;
            verificationStatus: import("../../../generated/prisma").$Enums.SitterVerificationStatus;
            userId: string;
            updatedAt: Date;
            petOwnerProfileId: string;
            bio: string | null;
            supportedPetTypes: string[];
            maxPets: number;
            city: string;
            emergencyContact: string;
            isAvailable: boolean;
            ratingAverage: number;
            totalReviews: number;
        })[];
        total: number;
    }>;
    static approveSitter(sitterId: string): Promise<{
        id: string;
        createdAt: Date;
        address: string;
        verificationStatus: import("../../../generated/prisma").$Enums.SitterVerificationStatus;
        userId: string;
        updatedAt: Date;
        petOwnerProfileId: string;
        bio: string | null;
        supportedPetTypes: string[];
        maxPets: number;
        city: string;
        emergencyContact: string;
        isAvailable: boolean;
        ratingAverage: number;
        totalReviews: number;
    }>;
    static rejectSitter(sitterId: string): Promise<{
        id: string;
        createdAt: Date;
        address: string;
        verificationStatus: import("../../../generated/prisma").$Enums.SitterVerificationStatus;
        userId: string;
        updatedAt: Date;
        petOwnerProfileId: string;
        bio: string | null;
        supportedPetTypes: string[];
        maxPets: number;
        city: string;
        emergencyContact: string;
        isAvailable: boolean;
        ratingAverage: number;
        totalReviews: number;
    }>;
}
//# sourceMappingURL=sitting.service.d.ts.map