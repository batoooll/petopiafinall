import { z } from "zod";
export declare const ReportLostPetSchema: z.ZodObject<{
    species: z.ZodEnum<{
        DOG: "DOG";
        CAT: "CAT";
    }>;
    description: z.ZodString;
    lastSeenLocation: z.ZodString;
    lastSeenDate: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    breed: z.ZodOptional<z.ZodString>;
    gender: z.ZodOptional<z.ZodEnum<{
        MALE: "MALE";
        FEMALE: "FEMALE";
    }>>;
    color: z.ZodOptional<z.ZodString>;
    petId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const ReportFoundPetSchema: z.ZodObject<{
    species: z.ZodEnum<{
        DOG: "DOG";
        CAT: "CAT";
    }>;
    description: z.ZodString;
    foundLocation: z.ZodString;
    isPetStillAtLocation: z.ZodPreprocess<z.ZodBoolean>;
    breed: z.ZodOptional<z.ZodString>;
    gender: z.ZodOptional<z.ZodEnum<{
        MALE: "MALE";
        FEMALE: "FEMALE";
    }>>;
    color: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ReportLostPetInput = z.infer<typeof ReportLostPetSchema>;
export type ReportFoundPetInput = z.infer<typeof ReportFoundPetSchema>;
//# sourceMappingURL=lostFound.dto.d.ts.map