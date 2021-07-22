import {AuthController} from "../controllers/auth.controller";

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
    const authController = await AuthController.getInstance();
    if (!(await authController.isValidToken(req.params.resetToken, req.params.username))) {
        return res.status(400).end();
    }
    next();
}
