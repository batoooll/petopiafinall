"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../common/middlewares/auth.middleware");
const ai_controller_1 = require("./ai.controller");
const router = (0, express_1.Router)();
router.post("/chat", auth_middleware_1.protect, ai_controller_1.AiController.chat);
exports.default = router;
//# sourceMappingURL=ai.routes.js.map