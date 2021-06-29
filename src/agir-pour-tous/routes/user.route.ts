import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {UserController} from "../controllers/user.controller";
import {hasAdminRights, isAskedUser, isNotAskedUser} from "../middlewares/user.middleware";
import {User} from "../models/user.model";

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
        const eventParticipation = await userController.getEventsParticipation(username);
        res.json(eventParticipation);
    } catch (err) {
        res.status(400).json(err);
    }
});

userRouter.put("/:userId/block", ensureLoggedIn, isNotAskedUser, async (req, res) => {
    try {
        const userId = req.params.userId;
        const currentUserId = (req.user as User).id;
        const userController = UserController.getInstance();
        await userController.blockUser(currentUserId, userId);
        res.status(204).end();
    } catch (err) {
        res.status(400).json(err);
    }
});

userRouter.delete("/:userId/unblock", ensureLoggedIn, isNotAskedUser, async (req, res) => {
    try {
        const userId = req.params.userId;
        const currentUserId = (req.user as User).id;
        const userController = UserController.getInstance();
        await userController.unblockUser(currentUserId, userId);
        res.status(204).end();
    } catch (err) {
        res.status(400).json(err);
    }
});

/**
 *  Is the given user blocked by the connected user
 */
userRouter.get("/:userId/is-blocked", ensureLoggedIn, isNotAskedUser, async (req, res) => {
    try {
        const userId = req.params.userId;
        const currentUserId = (req.user as User).id;
        const userController = UserController.getInstance();
        const isBlocked = await userController.isBlocked(currentUserId, userId);
        res.json(isBlocked);
    } catch (err) {
        res.status(400).json(err);
    }
});

/**
 *  Is the current user blocked by the given user
 */
userRouter.get("/:userId/blocked", ensureLoggedIn, isNotAskedUser, async (req, res) => {
    try {
        const userId = req.params.userId;
        const currentUserId = (req.user as User).id;
        const userController = UserController.getInstance();
        const isBlocked = await userController.isBlocked(userId, currentUserId);
        res.json(isBlocked);
    } catch (err) {
        res.status(400).json(err);
    }
});

userRouter.put("/:username/report", ensureLoggedIn, isNotAskedUser, async (req, res) => {
    try {
        const username = req.params.username;
        const userReporter = (req.user as User);
        const userController = UserController.getInstance();
        const reportedUser = await userController.getByUsername(username);
        const report = await userController.reportUser(userReporter, reportedUser, {...req.body});
        res.json(report);
    } catch (err) {
        res.status(400).json(err);
    }
});

userRouter.get("/:username/reports", ensureLoggedIn, hasAdminRights, async (req, res) => {
    try {
        const username = req.params.username;
        const userController = UserController.getInstance();
        const reports = await userController.getReports(username);
        res.json(reports);
    } catch (err) {
        res.status(400).json(err);
    }
});

export {
    userRouter
}

