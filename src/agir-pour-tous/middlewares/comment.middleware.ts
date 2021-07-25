import {User, UserType} from "../models/user.model";
import {CommentController} from "../controllers/comment.controller";
import {logger} from "../config/logging.config";

export async function isCommentOwner(req, res, next) {
    try {
        const commentId = req.params.commentId;
        const commentController = CommentController.getInstance();
        if (req.user && ((req.user as User).id !== (await commentController.getOwner(commentId)).id ||
            (req.user as User).userType === UserType.ADMIN || (req.user as User).userType === UserType.SUPER_ADMIN)) {
            res.status(403).end();
        }
        next();
    } catch (e) {
        logger.error("middleware isCommentOwner: " + e);
        res.status(400).end();
    }
}
