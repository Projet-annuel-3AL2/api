import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {PostController} from "../controllers/post.controller";
import {User} from "../models/user.model";

const postRouter = express.Router();

postRouter.post('/', ensureLoggedIn, async (req, res) => {
    try {
        const postController = PostController.getInstance();
        const post = postController.create(req.user as User, req.body);
        res.json(post);
    } catch (err) {
        res.status(400).json(err);
    }
});

postRouter.get('/', async (req, res) => {
    try {
        const postController = PostController.getInstance();
        const post = postController.getAll();
        res.json(post);
    } catch (err) {
        res.status(400).json(err);
    }
});

postRouter.get('/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const postController = PostController.getInstance();
        const post = postController.getById(postId);
        res.json(post);
    } catch (err) {
        res.status(404).json(err);
    }
});

postRouter.delete('/:postId', ensureLoggedIn, async (req, res) => {
    try {
        const postId = req.params.postId;
        const postController = PostController.getInstance();
        const post = postController.delete(postId);
        res.json(post);
    } catch (err) {
        res.status(400).json(err);
    }
});

postRouter.put('/:postId', ensureLoggedIn, async (req, res) => {
    try {
        const postId = req.params.postId;
        const postController = PostController.getInstance();
        const post = postController.update(postId, {...req.body});
        res.json(post);
    } catch (err) {
        res.status(400).json(err);
    }
});

postRouter.get("/:postId/likes", async (req, res) => {
    try {
        const postId = req.params.postId;
        const postController = PostController.getInstance();
        const likes = postController.getLikes(postId)
        res.json(likes);
    } catch (err) {
        res.status(400).json(err);
    }
});

export {
    postRouter
}

