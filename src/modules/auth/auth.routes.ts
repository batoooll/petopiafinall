import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/register-owner", AuthController.registerPetOwner);

router.post("/register-vet", AuthController.registerVet);

router.post("/login", AuthController.login);

export default router;