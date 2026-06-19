import { Response, NextFunction } from "express";
import { AuthRequest } from "../../common/middlewares/auth.middleware";
export declare class LostFoundController {
    static reportLostPet: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    static reportFoundPet: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    static getLostReports: (_req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    static getFoundReports: (_req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    static deleteFoundReport: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=lostFound.controller.d.ts.map