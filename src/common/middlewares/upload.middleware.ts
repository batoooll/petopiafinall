import multer, { StorageEngine } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";
import { AppError, HttpCode } from "../errors/AppError";

const storage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    const destination = "uploads/certificates/";
    fs.mkdirSync(destination, { recursive: true });
    cb(null, destination);
  },
  filename: (req: Request, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

export const upload = multer({
  storage,
  fileFilter: (req: Request, file: Express.Multer.File, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new AppError("Only images are allowed", HttpCode.BAD_REQUEST) as any, false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
