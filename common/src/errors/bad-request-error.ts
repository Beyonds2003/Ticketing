import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {

    statusCode = 400

    constructor(public message: string) {
        super()

        Object.setPrototypeOf(this, BadRequestError.prototype)
    }

    seralizeError() {
        return [
            {message: this.message}
        ]
    }

}