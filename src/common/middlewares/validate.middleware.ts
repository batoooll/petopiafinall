import { NextFunction, Request, Response } from "express";
import { z, type ZodTypeAny } from "zod";
import { AppError, HttpCode } from "../errors/AppError";

export const validate =
  (schema: ZodTypeAny) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(
          new AppError(
            error.issues.map((issue) => issue.message).join(", "),
            HttpCode.BAD_REQUEST
          )
        );
      }
      next(error);
    }
  };

export const validateQuery =
  (schema: ZodTypeAny) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync(req.query);
      Object.assign(req.query, parsed);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(
          new AppError(
            error.issues.map((issue) => issue.message).join(", "),
            HttpCode.BAD_REQUEST
          )
        );
      }
      next(error);
    }
  };

export const validateParams =
  (schema: ZodTypeAny) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync(req.params);
      req.params = parsed as Request["params"];
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(
          new AppError(
            error.issues.map((issue) => issue.message).join(", "),
            HttpCode.BAD_REQUEST
          )
        );
      }
      next(error);
    }
  };