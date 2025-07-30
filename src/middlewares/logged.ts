import jwt from "jsonwebtoken";
import { NextFunction, Response, Request } from "express";

export const OnlyGuest = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  let { token } = request.cookies;
  if (token) {
    response.preconditionFailed();
  } else {
    next();
  }
};

export const AuthProtected = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  let { token } = request.cookies;
  if (token) {
    jwt.verify(token, process.env.SECRET!, (error: any, decoded: any) => {
      if (error) {
        response.unauthorized();
      } else {
        delete decoded.exp;
        delete decoded.iat;
        request.auth_user = decoded;
        next();
      }
    });
  } else {
    response.unauthorized();
  }
};
