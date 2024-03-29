import express from "express";
import passport from "passport";
import {AuthController} from "../controllers/auth.controller";
import {ensureLoggedIn, ensureLoggedOut} from "../middlewares/auth.middleware";
import {UserController} from "../controllers/user.controller";
import {User} from "../models/user.model";


const authRouter = express.Router();

authRouter.post('/login', ensureLoggedOut, passport.authenticate('local-org-app'), async (req, res) => {
    const userController = await UserController.getInstance();
    const user = await userController.getById((req.user as User).id);
    res.json(user);
});

authRouter.delete('/logout', ensureLoggedIn, async (req, res) => {
    req.logout();
    res.status(204).end();
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

export {
    authRouter
}

