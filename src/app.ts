import express from "express";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import { errorMiddleware } from "./common/middlewares/error.middleware";
import clinicRoutes from "./modules/clinics/clinic.routes";


const app = express();

app.get("/", (req, res) => {
  res.send("Petopia API is running 🚀");
});
app.use(express.json());

app.use("/auth", authRoutes);

app.use("/users", userRoutes);

app.use("/clinic", clinicRoutes);

app.use(errorMiddleware);

export default app;