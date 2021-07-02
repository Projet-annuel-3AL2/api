import express from "express";
import {FriendshipController} from "../controllers/friendship.controller";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {User} from "../models/user.model";
import {UserController} from "../controllers/user.controller";

const friendshipRouter = express.Router();

friendshipRouter.get("/sent-friendship-request", ensureLoggedIn, async (req, res) => {
    try {
        const username = (req.user as User).id;
        const friendshipController = FriendshipController.getInstance();
        const friendship = await friendshipController.sentFriendshipRequest(username);
        res.json(friendship);
    } catch (err) {
        res.status(400).json(err);
    }
});

friendshipRouter.get("/received-friendship-request", ensureLoggedIn, async (req, res) => {
    try {
        const username = (req.user as User).id;
        const friendshipController = FriendshipController.getInstance();
        const friendship = await friendshipController.receivedFriendshipRequest(username);
        res.json(friendship);
    } catch (err) {
        res.status(400).json(err);
    }
});

friendshipRouter.post("/:username", ensureLoggedIn, async (req, res) => {
    try {
        const username = req.params.username;
        const userController = UserController.getInstance();
        const user = await userController.getByUsername(username);
        const friendshipController = FriendshipController.getInstance();
        const friendship = await friendshipController.sendFriendRequest(req.user as User, user);
        res.json(friendship);
    } catch (err) {
        res.status(400).json(err);
    }
});

friendshipRouter.delete("/:friendRequestId/reject", ensureLoggedIn, async (req, res) => {
    try {
        const friendRequestId = req.params.friendRequestId;
        const friendshipController = FriendshipController.getInstance();
        const friendship = await friendshipController.cancelFriendRequest(friendRequestId);
        res.json(friendship);
    } catch (err) {
        res.status(400).json(err);
    }
});

friendshipRouter.put("/:username", ensureLoggedIn, async (req, res) => {
    try {
        const username = req.params.username;
        const userController = UserController.getInstance();
        const user = await userController.getByUsername(username)
        const friendshipController = FriendshipController.getInstance();
        const friendship = await friendshipController.acceptFriendRequest(user, req.user as User);
        res.json(friendship);
    } catch (err) {
        res.status(400).json(err);
    }
});

friendshipRouter.delete("/:username/remove", ensureLoggedIn, async (req, res) => {
    try {
        const username = req.params.username;
        const friendshipController = FriendshipController.getInstance();
        const friendship = await friendshipController.removeFriendship(username, (req.user as User).id);
        res.json(friendship);
    } catch (err) {
        res.status(400).json(err);
    }
});

friendshipRouter.get("/:username/friendship-status", ensureLoggedIn, async (req, res) => {
    try {
        const username = req.params.username;
        const friendshipController = FriendshipController.getInstance();
        const isFriendshipRequested = await friendshipController.isFriendshipRequested((req.user as User).id, username);
        res.json(isFriendshipRequested);
    } catch (err) {
        res.status(400).json(err);
    }
});

export {
    friendshipRouter
}

