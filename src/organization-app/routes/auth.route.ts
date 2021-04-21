import express from "express";
import passport from "passport";
import {AuthController} from "../controllers/auth.controller";
import {User} from "../models/user.model";
import {validate} from "class-validator";
import {hash} from "bcrypt";
import {ensureLoggedIn, ensureLoggedOut} from "connect-ensure-login";


const authRouter = express.Router();

authRouter.post('/login', ensureLoggedOut("local-org-app"), passport.authenticate('local-org-app'), async function (req, res) {
    res.json(req.user);
});

authRouter.delete('/logout', ensureLoggedIn("local-org-app"), async function (req, res) {
    req.logout();
    res.status(204).end();
});

authRouter.post('/register', ensureLoggedOut("local-org-app"), async function (req, res) {
    const authController = await AuthController.getInstance();
    try {
        const user: User = new User();
        user.lastName = req.body.lastName;
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.username = req.body.username;
        user.mail = req.body.mail;
        user.password = await hash(req.body.password, 8);
        user.isAdmin = req.body.isAdmin;
        const errors = await validate(user);
        if (errors.length > 0) {
            throw errors;
        }
        await authController.register(user);
        res.json(user);
    } catch (error) {
        res.status(400).json({error: error}).end();
    }
});

export {
    authRouter
}

