// import { Request, Response, NextFunction } from "express";
// import { verifyToken } from "../utils/jwt";

// export interface AuthRequest extends Request {
//   user?: any;
// }

// export const authMiddleware = (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ) => {

//   const header = req.headers.authorization;

//   if (!header)
//     return res.status(401).json({ message: "Unauthorized" });

//   const token = header.split(" ")[1];

//   try {

//     const decoded = verifyToken(token);

//     req.user = decoded;

//     next();

//   } catch {

//     res.status(401).json({ message: "Invalid token" });

//   }

// };

import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { User, UserRole } from '../../../generated/prisma'; 
import { AppError, HttpCode } from "../errors/AppError";

// 1. Protect: Checks if the user is logged in
export const protect = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized', HttpCode.UNAUTHORIZED));
  }

  const token = header.split(" ")[1];

  try {
    const decoded = verifyToken(token);
   // Replace your assignment line with this:
    req.user = decoded as unknown as User;
    next();
  } catch {
    return next(new AppError('Invalid token', HttpCode.UNAUTHORIZED));
  }
};

// 2. RestrictTo: Checks if the user has the required role
export const restrictTo = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', HttpCode.FORBIDDEN));
    }
    next();
  };
};

export default { protect, restrictTo };