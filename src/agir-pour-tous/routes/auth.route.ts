import express from "express";
import passport from "passport";
import {ensureLoggedIn, ensureLoggedOut} from "../middlewares/auth.middleware";
import {AuthController} from "../controllers/auth.controller";

const authRouter = express.Router();

authRouter.post('/login', ensureLoggedOut, passport.authenticate('local-agir-pour-tous'), async (req, res) => {
    res.json(req.user);
});

authRouter.post('/register', ensureLoggedOut, async (req, res) => {
    try {
        const authController = AuthController.getInstance();
        const user = await authController.register({...req.body});
        res.json(user);
    } catch (err) {
        res.status(400).json(err);
    }
});


authRouter.get("/forgot-password/:username", ensureLoggedOut, async (req, res) => {
    const username = req.params.username;
    try {
        const authController = await AuthController.getInstance();
        const token = await authController.forgotPassword(username);
        res.send(token);
    } catch (err) {
        res.status(400).json(err);
    }
});

authRouter.post("/reset-password/:resetToken", ensureLoggedOut, async (req, res) => {
    const resetToken = req.params.resetToken;
    try {
        const authController = await AuthController.getInstance();
        await authController.resetPassword(resetToken, req.body.password);
        res.end();
    } catch (err) {
        res.status(400).json(err);
    }
});

authRouter.delete('/logout', ensureLoggedIn, async (req, res) => {
    req.logout();
    res.status(204).end();
});

export {
    authRouter
}

