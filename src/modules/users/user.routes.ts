import { Router } from "express";
import { UserController } from "./user.controller";
import { authMiddleware } from "../../common/middlewares/auth.middleware";

const router = Router();

// GET /users/me - Get current user profile
router.get("/me", authMiddleware, UserController.getMe);

// PUT /users/me - Update user profile (fullName, age, gender, phone, etc.)
router.put("/me", authMiddleware, UserController.updateProfile);

// PUT /users/me/password - Update password
router.put("/me/password", authMiddleware, UserController.updatePassword);

// DELETE /users/me - Delete user profile
router.delete("/me", authMiddleware, UserController.deleteProfile);

export default router;