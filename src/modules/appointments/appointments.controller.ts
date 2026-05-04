import { Response, NextFunction } from "express";
import { AuthRequest } from "../../common/middlewares/auth.middleware";
import { AppointmentsService } from "./appointments.service";

export class AppointmentsController {
  static createAppointment = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const appointment = await AppointmentsService.createAppointment(req.user!.userId, req.body);

      res.status(201).json({
        success: true,
        message: "Appointment created successfully",
        data: appointment,
      });
    } catch (error) {
      next(error);
    }
  };
}
