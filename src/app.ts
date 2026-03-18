import express from "express";
import authRoutes from "./modules/auth/auth.routes";
import { errorMiddleware } from "./common/middlewares/error.middleware";
import clinicRoutes from "./modules/clinics/clinic.routes";

const app = express();

app.get("/", (req, res) => {
  res.send("Petopia API is running 🚀");
});
app.use(express.json());

app.use("/auth", authRoutes);

app.use(errorMiddleware);

app.use("/clinic", clinicRoutes);

export default app;