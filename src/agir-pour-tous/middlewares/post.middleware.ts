import {User, UserType} from "../models/user.model";
import {PostController} from "../controllers/post.controller";
import {logger} from "../config/logging.config";

export function isPostOwner(req, res, next) {
    try {
        const postId = req.params.postId;
        const postController = PostController.getInstance();
        if (!req.user && (!postController.isPostOwner(postId, (req.user as User).id) ||
            (req.user as User).userType === UserType.ADMIN || (req.user as User).userType === UserType.SUPER_ADMIN)) {
            return res.status(403).end();
        }
        next();
    } catch (e) {
        logger.error("middleware isPostOwner: " + e);
        res.status(400).end(e);
    }
}
