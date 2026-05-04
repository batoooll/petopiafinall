import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import clinicRoutes from "./modules/clinics/clinic.routes";
import adminRoutes from "./modules/admin/admin.routes";
import vetRoutes from "./modules/vets/vet.routes";
import appointmentRoutes from "./modules/appointments/appointments.routes";
import { errorMiddleware } from "./common/middlewares/error.middleware";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Petopia API is running",
    data: { status: "ok" },
  });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/clinic", clinicRoutes);
app.use("/admin", adminRoutes);
app.use("/vets", vetRoutes);
app.use("/appointments", appointmentRoutes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    error: "Route not found",
  });
});

app.use(errorMiddleware);

export default app;
