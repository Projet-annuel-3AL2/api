import express from "express";
import passport from "passport";
import {AuthController} from "../controllers/auth.controller";
import {User} from "../models/user.model";
import {ensureAdminLoggedIn, ensureLoggedIn, ensureLoggedOut} from "../middlewares/auth.middleware";


const authRouter = express.Router();

authRouter.post('/login', ensureLoggedOut, passport.authenticate('local-org-app'), async (req, res) => {
    res.json(req.user).status(200).end();
});

authRouter.delete('/logout', ensureLoggedIn, async (req, res) => {
    req.logout();
    res.status(204).end();
});

authRouter.post('/signup', ensureAdminLoggedIn, async (req, res) => {
    const authController = await AuthController.getInstance();
    try {
        const user: User = new User();
        await authController.register({...req.body});
        res.json(user).status(200).end();
    } catch (error) {
        res.status(400).json(error).end();
    }
});

export {
    authRouter
}

