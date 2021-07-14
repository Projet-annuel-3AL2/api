import express from "express";
import {ConversationController} from "../controllers/conversation.controller";
import {User} from "../models/user.model";
import {logger} from "../config/logging.config";

const conversationRouter = express.Router();

conversationRouter.get("/:conversationId", async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        const conversationController = ConversationController.getInstance();
        const conversation = await conversationController.getById(conversationId);
        res.json(conversation);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

conversationRouter.get("/:conversationId/messages", async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        const conversationController = ConversationController.getInstance();
        const messages = await conversationController.getMessages(conversationId);
        res.json(messages);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

conversationRouter.get("/:conversationId/last-message", async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        const conversationController = ConversationController.getInstance();
        const message = await conversationController.getLastMessage(conversationId);
        res.json(message);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

conversationRouter.post("/:conversationId/message", async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        const conversationController = ConversationController.getInstance();
        const conversation = await conversationController.getById(conversationId);
        const message = await conversationController.sendMessage(req.user as User, conversation, req.body);
        res.json(message);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

conversationRouter.get("/:conversationId/members", async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        const conversationController = ConversationController.getInstance();
        const members = await conversationController.getMembers(conversationId);
        res.json(members);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

export {
    conversationRouter
}

