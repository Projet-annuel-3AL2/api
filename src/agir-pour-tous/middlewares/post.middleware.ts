import {User} from "../models/user.model";
import {PostController} from "../controllers/post.controller";

export function isPostOwner(req, res, next) {
    const postId = req.params.postId;
    const postController = PostController.getInstance();
    if (!req.user && !postController.isPostOwner(postId, (req.user as User).id)) {
        return res.status(403).end();
    }
    next();
}
