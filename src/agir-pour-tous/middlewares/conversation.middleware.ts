import {User} from "../models/user.model";
import {ConversationController} from "../controllers/conversation.controller";
import {logger} from "../config/logging.config";

export async function isConversationMember(req, res, next) {
    try {
        const conversationId = req.params.conversationId;
        const conversationController = ConversationController.getInstance();
        if (!req.user && !(await conversationController.getMembers(conversationId)).some(user => user.id === (req.user as User).id)) {
            return res.status(403).end();
        }
        next();
    } catch (e) {
        logger.error("middleware isConversationMember: " + e);
        res.status(400).end();
    }
}
