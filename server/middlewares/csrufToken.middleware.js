import csurf from "csurf";
import { ApiError } from "../utils/ApiError.js";

// CSRF middleware for csrf attacks
const csrfProtection = csurf({
    cookie: {
        httpOnly: true,
        sameSite: 'strict'
    }
});

// validation for the csrf token
const validatecsrfToken = (req, res, next) => {
    // console.log("Incoming CSRF Token:", req.headers['csrf-token']);
    csrfProtection(req, res, (err) => {
        if (err) {
            if (err.code === 'EBADCSRFTOKEN') {
                return res.status(403).send(new ApiError(403, 'Invalid CSRF token.'));
            }
            return next(err);
        }
        next();
    });
};


export { validatecsrfToken, csrfProtection };