import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";

export const validateBody = (type: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const object = plainToInstance(type, req.body);
    const errors = await validate(object);

    if (errors.length > 0) {
      res.status(400).json({
        status: false,
        message: "Validation failed",
        errors: errors.map((err) => ({
          property: err.property,
          constraints: err.constraints,
        })),
      });
      return;
    } else {
      next();
    }
  };
};
