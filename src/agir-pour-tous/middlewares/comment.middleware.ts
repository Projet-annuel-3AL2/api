import {User, UserType} from "../models/user.model";
import {CommentController} from "../controllers/comment.controller";

export async function isCommentOwner(req, res, next) {
    const commentId = req.params.commentId;
    const commentController = CommentController.getInstance();
    if (req.user && ((req.user as User).id !== (await commentController.getOwner(commentId)).id ||
        (req.user as User).userType === UserType.ADMIN || (req.user as User).userType === UserType.SUPER_ADMIN)) {
        res.status(403).end();
    }
    next();
}
