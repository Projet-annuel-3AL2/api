import express from "express";
import {FriendshipController} from "../controllers/friendship.controller";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {User} from "../models/user.model";
import {UserController} from "../controllers/user.controller";

const friendshipRouter = express.Router();

friendshipRouter.post("/:username", ensureLoggedIn, async (req, res) => {
    try {
        const username = req.params.username;
        const userController = UserController.getInstance();
        const user = await userController.getByUsername(username)
        const friendshipController = FriendshipController.getInstance();
        const friendship = await friendshipController.sendFriendRequest(req.user as User, user);
        res.json(friendship);
    } catch (err) {
        res.status(400).json(err);
    }
});

friendshipRouter.delete("/:username", ensureLoggedIn, async (req, res) => {
    try {
        const username = req.params.username;
        const friendshipController = FriendshipController.getInstance();
        const friendship = await friendshipController.cancelFriendRequest((req.user as User).username, username);
        res.json(friendship);
    } catch (err) {
        res.status(400).json(err);
    }
});

export {
    friendshipRouter
}

