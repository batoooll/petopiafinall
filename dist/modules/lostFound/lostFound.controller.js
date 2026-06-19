"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LostFoundController = void 0;
const lostFound_service_1 = require("./lostFound.service");
class LostFoundController {
    static reportLostPet = async (req, res, next) => {
        try {
            const files = req.files ?? [];
            const imageBuffers = files.map((f) => ({ buffer: f.buffer, filename: f.filename ?? f.originalname }));
            const baseUrl = `${req.protocol}://${req.get("host")}`;
            const report = await lostFound_service_1.LostFoundService.reportLostPet(req.user.userId, req.body, imageBuffers, baseUrl);
            res.status(201).json({
                success: true,
                message: "Lost pet report submitted successfully",
                data: report,
                error: null,
            });
        }
        catch (err) {
            next(err);
        }
    };
    static reportFoundPet = async (req, res, next) => {
        try {
            const files = req.files ?? [];
            const imageBuffers = files.map((f) => ({ buffer: f.buffer, filename: f.filename ?? f.originalname }));
            const baseUrl = `${req.protocol}://${req.get("host")}`;
            const report = await lostFound_service_1.LostFoundService.reportFoundPet(req.user.userId, req.body, imageBuffers, baseUrl);
            res.status(201).json({
                success: true,
                message: "Found pet report submitted successfully",
                data: report,
                error: null,
            });
        }
        catch (err) {
            next(err);
        }
    };
    static getLostReports = async (_req, res, next) => {
        try {
            const reports = await lostFound_service_1.LostFoundService.getLostReports();
            res.json({
                success: true,
                message: "Lost pet reports retrieved successfully",
                data: reports,
                error: null,
            });
        }
        catch (err) {
            next(err);
        }
    };
    static getFoundReports = async (_req, res, next) => {
        try {
            const reports = await lostFound_service_1.LostFoundService.getFoundReports();
            res.json({
                success: true,
                message: "Found pet reports retrieved successfully",
                data: reports,
                error: null,
            });
        }
        catch (err) {
            next(err);
        }
    };
    static deleteFoundReport = async (req, res, next) => {
        try {
            await lostFound_service_1.LostFoundService.deleteFoundReport(req.user.userId, req.params['id']);
            res.json({
                success: true,
                message: "Found pet report deleted successfully",
                data: null,
                error: null,
            });
        }
        catch (err) {
            next(err);
        }
    };
}
exports.LostFoundController = LostFoundController;
//# sourceMappingURL=lostFound.controller.js.map