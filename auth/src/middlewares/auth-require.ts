import { Request, Response, NextFunction } from "express";
import { UnAuthorizedError } from "@nicole23_package/common";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new UnAuthorizedError();
  }
  next();
};
