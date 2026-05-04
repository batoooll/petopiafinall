"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("@/common/middlewares/auth.middleware");
const prisma_1 = require("../../../generated/prisma");
const admin_controller_1 = require("./admin.controller");
const router = (0, express_1.Router)();
// Public: admin login only
router.post("/login", admin_controller_1.adminController.login);
// All routes below require a valid JWT with ADMIN role
router.use(auth_middleware_1.protect, (0, auth_middleware_1.restrictTo)(prisma_1.UserRole.ADMIN));
// Vet approvals
router.get("/vets/pending", admin_controller_1.adminController.getPendingVets);
router.patch("/vets/:id/approve", admin_controller_1.adminController.approveVet);
router.patch("/vets/:id/reject", admin_controller_1.adminController.rejectVet);
// Sitter environment approvals
router.get("/sitters/pending", admin_controller_1.adminController.getPendingSitters);
router.patch("/sitters/:id/approve", admin_controller_1.adminController.approveSitter);
router.patch("/sitters/:id/reject", admin_controller_1.adminController.rejectSitter);
// Appointment payment (InstaPay invoice) approvals
router.get("/payments/pending", admin_controller_1.adminController.getPendingPayments);
router.patch("/payments/:id/approve", admin_controller_1.adminController.approvePayment);
router.patch("/payments/:id/reject", admin_controller_1.adminController.rejectPayment);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map