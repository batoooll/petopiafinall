import multer, { StorageEngine } from "multer";
import path from "path";
import { Request } from "express";

const storage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    cb(null, "uploads/certificates/");
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
      cb(new Error("Only images are allowed") as any, false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});