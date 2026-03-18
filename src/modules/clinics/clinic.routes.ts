// clinic.routes.ts
import { Router } from "express";
import { createClinic } from "./clinic.controller";

const router = Router();

router.post("/", createClinic);

export default router;