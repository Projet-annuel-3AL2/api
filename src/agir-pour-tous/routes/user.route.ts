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

userRouter.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const userController = UserController.getInstance();
        const user = await userController.getById(userId);
        res.json(user);
    } catch (err) {
        res.status(404).json(err);
    }
});

userRouter.delete('/:userId', ensureLoggedIn, isAskedUser, async (req, res) => {
    try {
        const userId = req.params.userId;
        const userController = UserController.getInstance();
        await userController.delete(userId);
        res.status(204);
    } catch (err) {
        res.status(400).json(err);
    }
});

userRouter.put('/:userId', ensureLoggedIn, isAskedUser, async (req, res) => {
    try {
        const userId = req.params.userId;
        const userController = UserController.getInstance();
        await userController.update(userId, {...req.body});
        res.status(204).end();
    } catch (err) {
        res.status(400).json(err);
    }
});

userRouter.get("/:userId/posts", async (req, res) => {
    try {
        const userId = req.params.userId;
        const userController = UserController.getInstance();
        const posts = await userController.getPosts(userId)
        res.json(posts);
    } catch (err) {
        res.status(400).json(err);
    }
});

userRouter.get("/:userId/conversations", ensureLoggedIn, isAskedUser, async (req, res) => {
    try {
        const userId = req.params.userId;
        const userController = UserController.getInstance();
        const conversations = await userController.getConversations(userId)
        res.json(conversations);
    } catch (err) {
        res.status(400).json(err);
    }
});

userRouter.get("/:userId/groups", async (req, res) => {
    try {
        const userId = req.params.userId;
        const userController = UserController.getInstance();
        const groups = await userController.getGroups(userId)
        res.json(groups);
    } catch (err) {
        res.status(400).json(err);
    }
});

userRouter.get("/:userId/participation", async (req, res) => {
    try {
        const userId = req.params.userId;
        const userController = UserController.getInstance();
        const eventsParticipation = await userController.getEventsParticipation(userId)
        res.json(eventsParticipation);
    } catch (err) {
        res.status(400).json(err);
    }
});


export {
    userRouter
}

