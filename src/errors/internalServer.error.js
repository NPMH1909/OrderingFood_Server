import { HttpStatusCode } from "axios"
import { BaseError } from "./base.error.js"

export class InternalServerError extends BaseError{
    constructor(message) {
        super(message)
        this.statusCode = HttpStatusCode.InternalServerError
      }
}
