import express from "express";
import passport from "passport";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {UserController} from "../controllers/user.controller";
import {isAskedUser} from "../middlewares/user.middleware";

const userRouter = express.Router();

userRouter.get('/', passport.authenticate('local-agir-pour-tous'), async (req, res) => {
    try{
        const userController = UserController.getInstance();
        const user = userController.getAll();
        res.json(user);
    }catch (err) {
        res.status(400).json(err);
    }
});

userRouter.get('/:username', async (req, res) => {
    try{
        const username= req.params.username;
        const userController = UserController.getInstance();
        const user = userController.getByUsername(username);
        res.json(user);
    }catch (err) {
        res.status(404).json(err);
    }
});

userRouter.delete('/:username', ensureLoggedIn, isAskedUser, async (req, res) => {
    try{
        const username= req.params.username;
        const userController = UserController.getInstance();
        const user = userController.delete(username);
        res.json(user);
    }catch (err) {
        res.status(400).json(err);
    }
});

userRouter.put('/:username', ensureLoggedIn, isAskedUser, async (req, res) => {
    try{
        const username= req.params.username;
        const userController = UserController.getInstance();
        const user = userController.update(username, {...req.body});
        res.json(user);
    }catch (err) {
        res.status(400).json(err);
    }
});

userRouter.get("/:username/posts", async (req, res) => {
    try{
        const username= req.params.username;
        const userController = UserController.getInstance();
        const posts = userController.getPosts(username)
        res.json(posts);
    } catch (err) {
        res.status(400).json(err);
    }
});

userRouter.get("/:username/conversations", ensureLoggedIn, isAskedUser, async (req, res) => {
    try{
        const username = req.params.username;
        const userController = UserController.getInstance();
        const conversations = userController.getConversations(username)
        res.json(conversations);
    } catch (err) {
        res.status(400).json(err);
    }
});

userRouter.get("/:username/groups", async (req, res) => {
    try{
        const username = req.params.username;
        const userController = UserController.getInstance();
        const groups = userController.getGroups(username)
        res.json(groups);
    } catch (err) {
        res.status(400).json(err);
    }
});

userRouter.get("/:username/participation", async (req, res) => {
    try{
        const username = req.params.username;
        const userController = UserController.getInstance();
        const eventsParticipation = userController.getEventsParticipation(username)
        res.json(eventsParticipation);
    } catch (err) {
        res.status(400).json(err);
    }
});


export {
    userRouter
}

