import express from "express";
import {FriendshipController} from "../controllers/friendship.controller";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {User} from "../models/user.model";
import {UserController} from "../controllers/user.controller";

const friendshipRouter = express.Router();

friendshipRouter.post("/:userId", ensureLoggedIn, async (req, res) => {
    try {
        const userId = req.params.userId;
        const userController = UserController.getInstance();
        const user = await userController.getById(userId)
        const friendshipController = FriendshipController.getInstance();
        const friendship = await friendshipController.sendFriendRequest(req.user as User, user);
        res.json(friendship);
    } catch (err) {
        res.status(400).json(err);
    }
});

friendshipRouter.delete("/:userId/reject", ensureLoggedIn, async (req, res) => {
    try {
        const userId = req.params.userId;
        const friendshipController = FriendshipController.getInstance();
        const friendship = await friendshipController.cancelFriendRequest((req.user as User).id, userId);
        res.json(friendship);
    } catch (err) {
        res.status(400).json(err);
    }
});

friendshipRouter.put("/:userId", ensureLoggedIn, async (req, res) => {
    try {
        const userId = req.params.userId;
        const userController = UserController.getInstance();
        const user = await userController.getById(userId)
        const friendshipController = FriendshipController.getInstance();
        const friendship = await friendshipController.acceptFriendRequest(user, req.user as User);
        res.json(friendship);
    } catch (err) {
        res.status(400).json(err);
    }
});

friendshipRouter.delete("/:userId/remove", ensureLoggedIn, async (req, res) => {
    try {
        const userId = req.params.userId;
        const friendshipController = FriendshipController.getInstance();
        const friendship = await friendshipController.removeFriendship(userId, (req.user as User).id);
        res.json(friendship);
    } catch (err) {
        res.status(400).json(err);
    }
});

export {
    friendshipRouter
}

