import express from "express";
import passport from "passport";
import {ensureLoggedIn, ensureLoggedOut} from "../middlewares/auth.middleware";
import {UserController} from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.get('/', ensureLoggedOut, passport.authenticate('local-agir-pour-tous'), async (req, res) => {
    try{
        const userController = UserController.getInstance();
        const user = userController.getAll();
        res.json(user);
    }catch (err) {
        res.status(400).json(err)
    }
});

userRouter.get('/:userId', ensureLoggedOut, async (req, res) => {
    try{
        const userId= req.params.userId;
        const userController = UserController.getInstance();
        const user = userController.getById(userId);
        res.json(user);
    }catch (err) {
        res.status(404).json(err)
    }
});

userRouter.delete('/:userId', ensureLoggedIn, async (req, res) => {
    try{
        const userId= req.params.userId;
        const userController = UserController.getInstance();
        const user = userController.delete(userId);
        res.json(user);
    }catch (err) {
        res.status(400).json(err)
    }
});

userRouter.put('/:userId', ensureLoggedIn, async (req, res) => {
    try{
        const userId= req.params.userId;
        const userController = UserController.getInstance();
        const user = userController.update(userId, {...req.body});
        res.json(user);
    }catch (err) {
        res.status(400).json(err)
    }
});

export {
    userRouter
}

