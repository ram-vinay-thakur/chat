class ApiError extends Error {
    constructor(
        statusCode,
        message = "An Error Ocurred!",
        errors = [],
        ErrorStack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.errors = errors;
        this.success = false;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export { ApiError };