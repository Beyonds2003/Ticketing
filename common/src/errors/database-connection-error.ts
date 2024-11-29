import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
    statusCode = 501

    constructor() {
        super()

        Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
    }

    seralizeError() {
        return [
            {message: "Faild to connect to database."}
        ]
    }
}