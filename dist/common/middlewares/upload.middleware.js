"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const AppError_1 = require("../errors/AppError");
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const destination = "uploads/certificates/";
        fs_1.default.mkdirSync(destination, { recursive: true });
        cb(null, destination);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path_1.default.extname(file.originalname);
        cb(null, uniqueName);
    },
});
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        }
        else {
            cb(new AppError_1.AppError("Only images are allowed", AppError_1.HttpCode.BAD_REQUEST), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});
//# sourceMappingURL=upload.middleware.js.map