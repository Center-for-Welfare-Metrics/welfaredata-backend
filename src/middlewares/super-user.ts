import { Request, Response, NextFunction } from "express";

export const SuperUserProtected = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { auth_user } = request;

  if (!auth_user?.super) {
    return response.status(403).json({
      error: "Access denied. Super user privileges required.",
    });
  }

  next();
};
