import {AuthController} from "../controllers/auth.controller";
import {logger} from "../config/logging.config";

export function ensureLoggedOut(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return res.status(403).end();
    }
    next();
}

export function ensureLoggedIn(req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.status(401).end();
    }
    next();
}

export async function isValidResetPasswordToken(req, res, next) {
    try {
        const authController = await AuthController.getInstance();
        if (!(await authController.isValidToken(req.params.resetToken, req.params.username))) {
            return res.status(400).end();
        }
        next();
    } catch (e) {
        logger.error("middleware isValidResetPasswordToken: " + e);
        res.status(400).end();
    }
}
