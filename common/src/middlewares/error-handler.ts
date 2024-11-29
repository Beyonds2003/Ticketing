import {Request, Response, NextFunction} from "express"
import { CustomError } from "../errors/custom-error"

export const errorHandler = (
    err: Error, 
    req: Request, 
    res: Response, 
    next: NextFunction) => {
        if(err instanceof CustomError) {
            return res.status(err.statusCode).send({errors: err.seralizeError()})
        }
        res.status(400).json({errors: {message: "Something went wrong!!!"}})
}