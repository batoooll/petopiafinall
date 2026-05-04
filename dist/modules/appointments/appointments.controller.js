"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsController = void 0;
const appointments_service_1 = require("./appointments.service");
class AppointmentsController {
    static createAppointment = async (req, res, next) => {
        try {
            const appointment = await appointments_service_1.AppointmentsService.createAppointment(req.user.userId, req.body);
            res.status(201).json({
                success: true,
                message: "Appointment created successfully",
                data: appointment,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.AppointmentsController = AppointmentsController;
//# sourceMappingURL=appointments.controller.js.map