"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportFoundPetSchema = exports.ReportLostPetSchema = void 0;
const zod_1 = require("zod");
exports.ReportLostPetSchema = zod_1.z.object({
    species: zod_1.z.enum(["DOG", "CAT"]),
    description: zod_1.z.string().min(10, "Description must be at least 10 characters"),
    lastSeenLocation: zod_1.z.string().min(1, "Last seen location is required"),
    lastSeenDate: zod_1.z.string().refine((v) => !isNaN(Date.parse(v)), "Invalid date"),
    // optional — autofilled when petId is supplied
    name: zod_1.z.string().optional(),
    breed: zod_1.z.string().optional(),
    gender: zod_1.z.enum(["MALE", "FEMALE"]).optional(),
    color: zod_1.z.string().optional(),
    // existing pet to autofill from
    petId: zod_1.z.string().optional(),
});
exports.ReportFoundPetSchema = zod_1.z.object({
    species: zod_1.z.enum(["DOG", "CAT"]),
    description: zod_1.z.string().min(10, "Description must be at least 10 characters"),
    foundLocation: zod_1.z.string().min(1, "Found location is required"),
    isPetStillAtLocation: zod_1.z.preprocess((v) => v === "true" || v === true, zod_1.z.boolean()),
    breed: zod_1.z.string().optional(),
    gender: zod_1.z.enum(["MALE", "FEMALE"]).optional(),
    color: zod_1.z.string().optional(),
});
//# sourceMappingURL=lostFound.dto.js.map