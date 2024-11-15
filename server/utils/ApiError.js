class ApiError extends Error {
    constructor(
        statusCode,
        message = "An Error Ocurred!",
        errors = [],
        ErrorStack = "",
        data=""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.errors = errors;
        this.success = false;

        if (ErrorStack) {
            this.ErrorStack = ErrorStack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export { ApiError };