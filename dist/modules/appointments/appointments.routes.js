"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../../generated/prisma");
const auth_middleware_1 = require("../../common/middlewares/auth.middleware");
const appointments_controller_1 = require("./appointments.controller");
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.protect, (0, auth_middleware_1.restrictTo)(prisma_1.UserRole.PET_OWNER), appointments_controller_1.AppointmentsController.createAppointment);
exports.default = router;
//# sourceMappingURL=appointments.routes.js.map