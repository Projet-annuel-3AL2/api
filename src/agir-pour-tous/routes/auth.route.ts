import express from "express";
import passport from "passport";
import {ensureLoggedIn, ensureLoggedOut, isValidResetPasswordToken} from "../middlewares/auth.middleware";
import {AuthController} from "../controllers/auth.controller";
import {logger} from "../config/logging.config";

const authRouter = express.Router();

authRouter.post('/login', ensureLoggedOut, passport.authenticate('local-agir-pour-tous'), async (req, res) => {
    res.json(req.user);
});

authRouter.post('/register', ensureLoggedOut, async (req, res,next) => {
    try {
        const authController = AuthController.getInstance();
        await authController.register({...req.body});
        next();
    } catch (err) {
        logger.error(err);
        res.status(400).json(err);
    }
},
    passport.authenticate('local-agir-pour-tous'),
    (req,res)=>res.json(req.user));


authRouter.get("/forgot-password/:username", ensureLoggedOut, async (req, res) => {
    const username = req.params.username;
    try {
        const authController = await AuthController.getInstance();
        await authController.forgotPassword(username);
        res.status(204).end();
    } catch (err) {
        logger.error(err);
        res.status(400).json(err);
    }
});

authRouter.get("/is-valid-token/:username/:resetToken", ensureLoggedOut, async (req, res) => {
    const resetToken = req.params.resetToken;
    const username = req.params.username;
    try {
        const authController = await AuthController.getInstance();
        const isValid = await authController.isValidToken(resetToken, username);
        res.json(isValid);
    } catch (err) {
        logger.error(err);
        res.status(400).json(err);
    }
});

authRouter.post("/reset-password/:username/:resetToken", ensureLoggedOut, isValidResetPasswordToken, async (req, res) => {
    const resetToken = req.params.resetToken;
    const username = req.params.username;
    const password = req.body.password;
    try {
        const authController = await AuthController.getInstance();
        await authController.resetPassword(resetToken, username, password);
        res.end();
    } catch (err) {
        logger.error(err);
        res.status(404).json(err);
    }
});

authRouter.delete('/logout', ensureLoggedIn, async (req, res) => {
    req.logout();
    res.status(204).end();
});

export {
    authRouter
}

