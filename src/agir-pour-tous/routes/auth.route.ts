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
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
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
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

authRouter.get("/is-valid-token/:username/:resetToken", ensureLoggedOut, async (req, res) => {
    const resetToken = req.params.resetToken;
    const username = req.params.username;
    try {
        const authController = await AuthController.getInstance();
        const isValid = await authController.isValidToken(resetToken, username);
        res.json(isValid);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
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
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(404).json(error);
    }
});

authRouter.delete('/logout', ensureLoggedIn, async (req, res) => {
    req.logout();
    res.status(204).end();
});

export {
    authRouter
}

