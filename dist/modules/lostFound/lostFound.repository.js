"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LostFoundRepository = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const prisma_2 = require("../../../generated/prisma");
const reportInclude = {
    images: true,
    owner: { select: { id: true, fullName: true, email: true } },
    finder: { select: { id: true, fullName: true, email: true } },
};
class LostFoundRepository {
    static async createLostReport(data) {
        return prisma_1.default.lostFoundReport.create({
            data: {
                status: prisma_2.LostFoundStatus.LOST,
                species: data.species,
                description: data.description,
                lastSeenLocation: data.lastSeenLocation,
                lastSeenDate: data.lastSeenDate,
                name: data.name ?? null,
                breed: data.breed ?? null,
                gender: data.gender ?? null,
                color: data.color ?? null,
                ownerId: data.ownerId,
                images: {
                    create: data.imageUrls.map((url) => ({ url })),
                },
            },
            include: reportInclude,
        });
    }
    static async createFoundReport(data) {
        return prisma_1.default.lostFoundReport.create({
            data: {
                status: prisma_2.LostFoundStatus.FOUND,
                species: data.species,
                description: data.description,
                foundLocation: data.foundLocation,
                isPetStillAtLocation: data.isPetStillAtLocation,
                breed: data.breed ?? null,
                gender: data.gender ?? null,
                color: data.color ?? null,
                finderId: data.finderId,
                images: {
                    create: data.imageUrls.map((url) => ({ url })),
                },
            },
            include: reportInclude,
        });
    }
    static async getLostReports() {
        return prisma_1.default.lostFoundReport.findMany({
            where: { status: prisma_2.LostFoundStatus.LOST },
            include: reportInclude,
            orderBy: { createdAt: "desc" },
        });
    }
    static async getFoundReports() {
        return prisma_1.default.lostFoundReport.findMany({
            where: { status: prisma_2.LostFoundStatus.FOUND },
            include: reportInclude,
            orderBy: { createdAt: "desc" },
        });
    }
    static async getReportById(id) {
        return prisma_1.default.lostFoundReport.findUnique({
            where: { id },
            include: reportInclude,
        });
    }
    static async deleteFoundReport(id, finderId) {
        return prisma_1.default.lostFoundReport.deleteMany({
            where: { id, finderId, status: prisma_2.LostFoundStatus.FOUND },
        });
    }
}
exports.LostFoundRepository = LostFoundRepository;
//# sourceMappingURL=lostFound.repository.js.map