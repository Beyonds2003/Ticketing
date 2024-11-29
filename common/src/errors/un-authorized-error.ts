import { CustomError } from "./custom-error";


export class UnAuthorizedError extends CustomError {
    statusCode = 401

    constructor() {
        super()

        Object.setPrototypeOf(this, UnAuthorizedError.prototype)
    }

    seralizeError() {
        return [{
            message: "Not authorized"
        }]
    }
}