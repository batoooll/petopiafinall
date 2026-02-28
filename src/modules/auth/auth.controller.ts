import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";

export class AuthController {

  static registerPetOwner = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {

      const result = await AuthService.registerPetOwner(req.body);

      res.status(201).json(result);

    } catch (err) {
      next(err);
    }
  };


  static registerVet = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {

      const result = await AuthService.registerVet(req.body);

      res.status(201).json(result);

    } catch (err) {
      next(err);
    }
  };


  static login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {

      const { email, password } = req.body;

      const result = await AuthService.login(email, password);

      res.json(result);

    } catch (err) {
      next(err);
    }
  };

}