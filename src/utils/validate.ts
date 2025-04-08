import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const validate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  next();
};
