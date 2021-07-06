import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {PostController} from "../controllers/post.controller";
import {User} from "../models/user.model";
import {hasAdminRights} from "../middlewares/user.middleware";
import {isPostOwner} from "../middlewares/post.middleware";

const postRouter = express.Router();

postRouter.post('/', ensureLoggedIn, async (req, res) => {
    try {
        const postController = await PostController.getInstance();
        const post = await postController.create(req.user as User, req.body);
        res.json(post);
    } catch (err) {
        res.status(400).json(err);
    }
});

postRouter.get('/', async (req, res) => {
    try {
        const postController = PostController.getInstance();
        const post = await postController.getAll();
        res.json(post);
    } catch (err) {
        res.status(400).json(err);
    }
});

postRouter.get('/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const postController = PostController.getInstance();
        const post = await postController.getById(postId);
        res.json(post);
    } catch (err) {
        res.status(404).json(err);
    }
});

postRouter.delete('/:postId', ensureLoggedIn, isPostOwner, async (req, res) => {
    try {
        const postId = req.params.postId;
        const postController = PostController.getInstance();
        const post = await postController.delete(postId);
        res.json(post);
    } catch (err) {
        res.status(400).json(err);
    }
});

postRouter.put('/:postId', ensureLoggedIn, isPostOwner, async (req, res) => {
    try {
        const postId = req.params.postId;
        const postController = PostController.getInstance();
        const post = await postController.update(postId, {...req.body});
        res.json(post);
    } catch (err) {
        res.status(400).json(err);
    }
});

postRouter.get("/:postId/like", ensureLoggedIn, async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = (req.user as User).id;
        const postController = PostController.getInstance();
        const likes = await postController.likePost(postId, userId);
        res.json(likes);
    } catch (err) {
        res.status(400).json(err);
    }
});

postRouter.get("/:postId/comments", ensureLoggedIn, async (req, res) => {
    try {
        const postId = req.params.postId;
        const postController = PostController.getInstance();
        const comments = await postController.getComments(postId);
        res.json(comments);
    } catch (err) {
        res.status(400).json(err);
    }
});

postRouter.delete("/:postId/like", ensureLoggedIn, async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = (req.user as User).id;
        const postController = PostController.getInstance();
        const likes = await postController.dislikePost(postId, userId);
        res.json(likes);
    } catch (err) {
        res.status(400).json(err);
    }
});

postRouter.get("/:postId/likes", async (req, res) => {
    try {
        const postId = req.params.postId;
        const postController = PostController.getInstance();
        const likes = await postController.getLikes(postId);
        res.json(likes);
    } catch (err) {
        res.status(400).json(err);
    }
});

postRouter.get("/timeline/:offset/:limit", async (req, res) => {
    try {
        const offset = parseInt(req.params.offset);
        const limit = parseInt(req.params.limit);
        const postController = PostController.getInstance();
        const posts = await postController.getTimeline((req.user as User).id, offset, limit);
        res.json(posts);
    } catch (err) {
        res.status(400).json(err);
    }
});

postRouter.get("/:postId/is-liked", ensureLoggedIn, async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = (req.user as User).id;
        const postController = PostController.getInstance();
        const likes = await postController.isLiked(postId, userId);
        res.json(likes);
    } catch (err) {
        res.status(400).json(err);
    }
});

postRouter.put("/:postId/report", ensureLoggedIn, async (req, res) => {
    try {
        const postId = req.params.postId;
        const userReporter = (req.user as User);
        const postController = PostController.getInstance();
        const reportedPost = await postController.getById(postId);
        const report = await postController.reportPost(userReporter, reportedPost, {...req.body});
        res.json(report);
    } catch (err) {
        res.status(400).json(err);
    }
});

postRouter.get("/:postId/reports", ensureLoggedIn, hasAdminRights, async (req, res) => {
    try {
        const postId = req.params.postId;
        const postController = PostController.getInstance();
        const reports = await postController.getReports(postId);
        res.json(reports);
    } catch (err) {
        res.status(400).json(err);
    }
});

postRouter.get("/:postId/is-owner", async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = (req.user as User).id;
        const postController = PostController.getInstance();
        const isOwner = await postController.isPostOwner(postId, userId);
        res.json({isOwner});
    } catch (err) {
        res.status(400).json(err);
    }
});

postRouter.post("/:postId/comment", async (req, res) => {
    try {
        const postId = req.params.postId;
        const postController = PostController.getInstance();
        const comment = await postController.addComment(postId, req.user as User,{...req.body});
        res.json(comment);
    } catch (err) {
        res.status(400).json(err);
    }
});

export {
    postRouter
}

