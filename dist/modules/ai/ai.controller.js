"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const gemini_service_1 = require("./gemini.service");
const AppError_1 = require("../../common/errors/AppError");
class AiController {
    static chat = async (req, res, next) => {
        try {
            const { message, history } = req.body;
            if (!message || typeof message !== "string" || !message.trim()) {
                return next(new AppError_1.AppError("Message is required", AppError_1.HttpCode.BAD_REQUEST));
            }
            const reply = await gemini_service_1.GeminiService.chat(message.trim(), history ?? []);
            res.json({
                success: true,
                message: "AI response generated successfully",
                data: { reply },
                error: null,
            });
        }
        catch (err) {
            // Surface Gemini API errors clearly instead of swallowing them
            const msg = err instanceof Error ? err.message : String(err);
            console.error("[Gemini]", msg);
            next(new AppError_1.AppError(`AI service error: ${msg}`, AppError_1.HttpCode.INTERNAL_SERVER_ERROR));
        }
    };
}
exports.AiController = AiController;
//# sourceMappingURL=ai.controller.js.map