import express from "express";
import {ConversationController} from "../controllers/conversation.controller";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {User} from "../models/user.model";

const conversationRouter = express.Router();

conversationRouter.get("/:conversationId", ensureLoggedIn, async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        const conversationController = ConversationController.getInstance();
        const conversation = await conversationController.getById(conversationId);
        res.json(conversation);
    } catch (err) {
        res.status(400).json(err);
    }
});

conversationRouter.post("/:conversationId", ensureLoggedIn, async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        const conversationController = ConversationController.getInstance();
        const conversation = await conversationController.getById(conversationId);
        const message = await conversationController.sendMessage(req.user as User, conversation, req.body);
        res.json(message);
    } catch (err) {
        res.status(400).json(err);
    }
});


export {
    conversationRouter
}

