import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {UserController} from "../controllers/user.controller";
import {isAskedUser} from "../middlewares/user.middleware";

const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
    try {
        const userController = UserController.getInstance();
        const user = await userController.getAll();
        res.json(user);
    } catch (err) {
        res.status(400).json(err);
    }
});

userRouter.get('/:username', async (req, res) => {
    try {
        const username = req.params.username;
        const userController = await UserController.getInstance();
        const user = await userController.getByUsername(username);
        res.json(user);
    } catch (err) {
        res.status(400).json(err);
    }
});

userRouter.get('/:username/posts', async (req, res) => {
    try {
        const username = req.params.username;
        const userController = await UserController.getInstance();
        const user = await userController.getPosts(username);
        res.json(user);
    } catch (err) {
        res.status(404).json(err);
    }
});

userRouter.delete('/:username', ensureLoggedIn, isAskedUser, async (req, res) => {
    try {
        const username = req.params.username;
        const userController = UserController.getInstance();
        await userController.delete(username);
        res.status(204).end();
    } catch (err) {
        res.status(400).json(err);
    }
});

userRouter.put('/:username', ensureLoggedIn, isAskedUser, async (req, res) => {
    try {
        const username = req.params.username;
        const userController = UserController.getInstance();
        await userController.update(username, {...req.body});
        res.status(204).end();
    } catch (err) {
        res.status(400).json(err);
    }
});

userRouter.get("/:username/posts", async (req, res) => {
    try {
        const username = req.params.username;
        const userController = UserController.getInstance();
        const posts = await userController.getPosts(username);
        res.json(posts);
    } catch (err) {
        res.status(400).json(err);
    }
});

userRouter.get("/:username/conversations", ensureLoggedIn, isAskedUser, async (req, res) => {
    try {
        const username = req.params.username;
        const userController = UserController.getInstance();
        const conversations = await userController.getConversations(username);
        res.json(conversations);
    } catch (err) {
        res.status(400).json(err);
    }
});

userRouter.get("/:username/groups", async (req, res) => {
    try {
        const username = req.params.username;
        const userController = UserController.getInstance();
        const groups = await userController.getGroups(username);
        res.json(groups);
    } catch (err) {
        res.status(400).json(err);
    }
});

userRouter.get("/:username/participation", async (req, res) => {
    try {
        const username = req.params.username;
        const userController = UserController.getInstance();
        const eventParticipation = await userController.getEventsParticipation(username)
        res.json(eventParticipation);
    } catch (err) {
        res.status(400).json(err);
    }
});

export {
    userRouter
}

