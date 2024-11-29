import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidateError extends CustomError {

    statusCode = 400

    constructor(public error: ValidationError[]) {
        super()

        Object.setPrototypeOf(this, RequestValidateError.prototype)
    }

    seralizeError() {
        return this.error.map(err => {
            return {message: err.msg, field: err.type}
        })
    }

}