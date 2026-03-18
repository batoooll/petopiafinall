// clinic.controller.ts
import { Request, Response, NextFunction } from "express";
import prisma from "../../config/prisma";

export const createClinic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, address, phone } = req.body;

    const clinic = await prisma.clinic.create({
      data: {
        name,
        address,
        phone,
      },
    });

    res.status(201).json(clinic);
  } catch (err) {
    next(err);
  }
};