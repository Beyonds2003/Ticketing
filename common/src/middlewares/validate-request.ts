import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { RequestValidateError } from "../errors/request-validate-error";

export const validateRequest = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const error = validationResult(req)

    if(!error.isEmpty()) {
        throw new RequestValidateError(error.array())
    }

    next()
}