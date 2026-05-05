import { Response, NextFunction } from "express";
import { AuthRequest } from "../../common/middlewares/auth.middleware";
import { PetService } from "./pets.service";

export class PetController {

  static createPet = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const pet = await PetService.createPet(req.user!.userId, req.body);

      res.status(201).json({
        success: true,
        message: "Pet created successfully",
        data: pet,
      });
    } catch (err) {
      next(err);
    }
  };

  static getMyPets = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const pets = await PetService.getMyPets(req.user!.userId, req.query);

      res.json({
        success: true,
        data: pets,
      });
    } catch (err) {
      next(err);
    }
  };

  static getPet = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const pet = await PetService.getPetById(
        req.user!.userId,
        req.params.id as string
      );

      res.json({ success: true, data: pet });
    } catch (err) {
      next(err);
    }
  };

  static updatePet = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const pet = await PetService.updatePet(
        req.user!.userId,
        req.params.id as string,
        req.body
      );

      res.json({ success: true, data: pet });
    } catch (err) {
      next(err);
    }
  };

  static deletePet = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await PetService.deletePet(
        req.user!.userId,
        req.params.id as string
      );

      res.json({
        success: true,
        message: "Pet deleted",
      });
    } catch (err) {
      next(err);
    }
  };
}