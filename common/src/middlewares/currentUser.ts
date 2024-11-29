import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

const decodeBase64 = (token: string): { jwt: string } => {
  let payload = atob(token);
  let payloadJson = JSON.parse(payload);
  return payloadJson;
};

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  const session = req.headers.cookie === undefined ? undefined : req.headers.cookie.split("=")[1]

  if (!session) {
    return next();
  }
  try {
    const token = decodeBase64(session as string).jwt;
    const payload = jwt.verify(token, process.env.JWT_KEY!) as UserPayload;
    req.currentUser = payload;
  } catch (error) {
    console.log(error);
  }

  next();
};

