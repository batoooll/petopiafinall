import { Router } from "express";
import { UserRole } from "../../../generated/prisma";
import { protect, restrictTo } from "../../common/middlewares/auth.middleware";
import { AppointmentsController } from "./appointments.controller";

const router = Router();

router.post("/", protect, restrictTo(UserRole.PET_OWNER), AppointmentsController.createAppointment);

export default router;
