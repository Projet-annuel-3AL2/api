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
        req.login(user,()=>{
            res.json(req.user)
        });
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
