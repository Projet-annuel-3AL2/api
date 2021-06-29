import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {PostController} from "../controllers/post.controller";
import {User} from "../models/user.model";

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

postRouter.delete('/:postId', ensureLoggedIn, async (req, res) => {
    try {
        const postId = req.params.postId;
        const postController = PostController.getInstance();
        const post = await postController.delete(postId);
        res.json(post);
    } catch (err) {
        res.status(400).json(err);
    }
});

postRouter.put('/:postId', ensureLoggedIn, async (req, res) => {
    try {
        const postId = req.params.postId;
        const postController = PostController.getInstance();
        const post = await postController.update(postId, {...req.body});
        res.json(post);
    } catch (err) {
        res.status(400).json(err);
    }
});

postRouter.get("/:postId/like", async (req, res) => {
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

postRouter.delete("/:postId/like", async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = (req.user as User).id;
        const postController = PostController.getInstance();
        const likes = await postController.dislikePost(postId, userId);
        res.json(likes);
    } catch (err) {
        console.log(err)
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

postRouter.get("/timeline/:offset/:limit", async (req, res) => {
    try{
        const offset=parseInt(req.params.offset);
        const limit=parseInt(req.params.limit);
        const postController = PostController.getInstance();
        const posts = await postController.getTimeline((req.user as User).id, offset, limit);
        res.json(posts);
    }catch (err) {
        console.log(err)
        res.status(400).json(err);
    }
});

postRouter.get("/:postId/is-liked", async (req, res) => {
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

export {
    postRouter
}

