import {User} from "../models/user.model";
import {CommentController} from "../controllers/comment.controller";

export async function isCommentOwner(req, res, next) {
    const commentId = req.params.commentId;
    const commentController = CommentController.getInstance();
    if (req.user && (req.user as User).id !== (await commentController.getOwner(commentId)).id) {
        res.status(403).end();
    }
    next();
}
