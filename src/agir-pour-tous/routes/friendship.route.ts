import express from "express";
import {FriendshipController} from "../controllers/friendship.controller";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {User} from "../models/user.model";
import {UserController} from "../controllers/user.controller";
import {logger} from "../config/logging.config";

const friendshipRouter = express.Router();

friendshipRouter.get("/sent-friendship-request", ensureLoggedIn, async (req, res) => {
    try {
        const userId = (req.user as User).id;
        const friendshipController = FriendshipController.getInstance();
        const friendship = await friendshipController.sentFriendshipRequest(userId);
        res.json(friendship);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

friendshipRouter.get("/received-friendship-request", ensureLoggedIn, async (req, res) => {
    try {
        const userId = (req.user as User).id;
        const friendshipController = FriendshipController.getInstance();
        const friendship = await friendshipController.receivedFriendshipRequest(userId);
        res.json(friendship);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

friendshipRouter.post("/:username", ensureLoggedIn, async (req, res) => {
    try {
        const username = req.params.username;
        const userController = UserController.getInstance();
        const user = await userController.getByUsername(username);
        const friendshipController = FriendshipController.getInstance();
        const friendship = await friendshipController.sendFriendRequest(req.user as User, user);
        logger.info(`User ${(req.user as User).username} has sent a friend request to user ${username}`);
        res.json(friendship);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

friendshipRouter.delete("/:username/cancel", ensureLoggedIn, async (req, res) => {
    try {
        const username = req.params.username;
        const friendshipController = FriendshipController.getInstance();
        const friendship = await friendshipController.cancelFriendRequest((req.user as User).username, username);
        logger.info(`User ${(req.user as User).username} has canceled the friend request sent to user ${username}`);
        res.json(friendship);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

friendshipRouter.delete("/:username/reject", ensureLoggedIn, async (req, res) => {
    try {
        const username = req.params.username;
        const friendshipController = FriendshipController.getInstance();
        const friendship = await friendshipController.cancelFriendRequest(username, (req.user as User).username);
        logger.info(`User ${(req.user as User).username} has rejected the friend request sent by user ${username}`);
        res.json(friendship);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

friendshipRouter.put("/:username", ensureLoggedIn, async (req, res) => {
    try {
        const username = req.params.username;
        const userController = UserController.getInstance();
        const user = await userController.getByUsername(username)
        const friendshipController = FriendshipController.getInstance();
        const friendship = await friendshipController.acceptFriendRequest(user, req.user as User);
        logger.info(`User ${(req.user as User).username} has accepted the friend request sent by user ${username}`);
        res.json(friendship);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

friendshipRouter.delete("/:username/remove", ensureLoggedIn, async (req, res) => {
    try {
        const username = req.params.username;
        const friendshipController = FriendshipController.getInstance();
        const friendship = await friendshipController.removeFriendship(username, (req.user as User).username);
        logger.info(`User ${(req.user as User).username} has removed user ${username} from his friends list`);
        res.json(friendship);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

friendshipRouter.get("/:username/friendship-status", ensureLoggedIn, async (req, res) => {
    try {
        const username = req.params.username;
        const friendshipController = FriendshipController.getInstance();
        const isFriendshipRequested = await friendshipController.isFriendshipRequested((req.user as User).username, username);
        res.json(isFriendshipRequested);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

export {
    friendshipRouter
}

