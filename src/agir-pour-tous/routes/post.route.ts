import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {PostController} from "../controllers/post.controller";
import {User} from "../models/user.model";
import {hasAdminRights} from "../middlewares/user.middleware";
import {isPostOwner} from "../middlewares/post.middleware";
import {logger} from "../config/logging.config";
import {upload} from "./index.route";
import {MediaController} from "../controllers/media.controller";
import {Media} from "../models/media.model";
import {arePicturesFiles} from "../middlewares/media.middleware";

const postRouter = express.Router();
postRouter.post('/', ensureLoggedIn, upload.array("post_medias",5), arePicturesFiles, async (req, res) => {
    try {
        const postController = await PostController.getInstance();
        const mediaController = await MediaController.getInstance();
        let medias: Media[] = [];
        if(req.files) {
            for (const file of req.files as Express.Multer.File[]) {
                medias.push(await mediaController.create(file));
            }
        }
        const post = await postController.create(req.user as User, {...req.body, medias});
        logger.info(`User ${(req.user as User).username} has created a post with id ${post.id}`);
        res.json(post);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

postRouter.get('/', async (req, res) => {
    try {
        const postController = PostController.getInstance();
        const post = await postController.getAll();
        res.json(post);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

postRouter.get('/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const postController = PostController.getInstance();
        const post = await postController.getById(postId);
        res.json(post);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(404).json(error);
    }
});

postRouter.delete('/:postId', ensureLoggedIn, isPostOwner, async (req, res) => {
    try {
        const postId = req.params.postId;
        const postController = PostController.getInstance();
        const post = await postController.delete(postId);
        logger.info(`User ${(req.user as User).username} has deleted a post with id ${postId}`);
        res.json(post);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

postRouter.put('/:postId', ensureLoggedIn, isPostOwner, async (req, res) => {
    try {
        const postId = req.params.postId;
        const postController = PostController.getInstance();
        const post = await postController.update(postId, {...req.body});
        logger.info(`User ${(req.user as User).username} has modified a post with id ${postId}`);
        res.json(post);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

postRouter.get("/:postId/like", ensureLoggedIn, async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = (req.user as User).id;
        const postController = PostController.getInstance();
        const likes = await postController.likePost(postId, userId);
        logger.info(`User ${(req.user as User).username} has liked a post with id ${postId}`);
        res.json(likes);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

postRouter.get("/:postId/comments", ensureLoggedIn, async (req, res) => {
    try {
        const postId = req.params.postId;
        const postController = PostController.getInstance();
        const comments = await postController.getComments(postId);
        res.json(comments);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

postRouter.delete("/:postId/like", ensureLoggedIn, async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = (req.user as User).id;
        const postController = PostController.getInstance();
        const likes = await postController.dislikePost(postId, userId);
        logger.info(`User ${(req.user as User).username} has removed his like to a post with id ${postId}`);
        res.json(likes);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

postRouter.get("/:postId/likes", async (req, res) => {
    try {
        const postId = req.params.postId;
        const postController = PostController.getInstance();
        const likes = await postController.getLikes(postId);
        res.json(likes);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

postRouter.get("/timeline/:offset/:limit", ensureLoggedIn, async (req, res) => {
    try {
        const offset = parseInt(req.params.offset);
        const limit = parseInt(req.params.limit);
        const postController = PostController.getInstance();
        const posts = await postController.getTimeline((req.user as User).id, offset, limit);
        res.json(posts);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

postRouter.get("/:postId/is-liked", ensureLoggedIn, async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = (req.user as User).id;
        const postController = PostController.getInstance();
        const likes = await postController.isLiked(postId, userId);
        res.json(likes);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

postRouter.put("/:postId/report", ensureLoggedIn, async (req, res) => {
    try {
        const postId = req.params.postId;
        const userReporter = (req.user as User);
        const postController = PostController.getInstance();
        const reportedPost = await postController.getById(postId);
        const report = await postController.reportPost(userReporter, reportedPost, {...req.body});
        logger.info(`User ${(req.user as User).username} has reported a post with id ${postId}`);
        res.json(report);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

postRouter.get("/:postId/reports", ensureLoggedIn, hasAdminRights, async (req, res) => {
    try {
        const postId = req.params.postId;
        const postController = PostController.getInstance();
        const reports = await postController.getReports(postId);
        res.json(reports);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

postRouter.get("/:postId/is-owner", async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = (req.user as User).id;
        const postController = PostController.getInstance();
        const isOwner = await postController.isPostOwner(postId, userId);
        res.json({isOwner});
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

postRouter.get("/:postId/shares", async (req, res) => {
    try {
        const postId = req.params.postId;
        const postController = PostController.getInstance();
        const sharedPost = await postController.getSharedPost(postId);
        res.json(sharedPost);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(404).json(error);
    }
});

postRouter.post("/:postId/comment", async (req, res) => {
    try {
        const postId = req.params.postId;
        const postController = PostController.getInstance();
        const comment = await postController.addComment(postId, req.user as User, {...req.body});
        logger.info(`User ${(req.user as User).username} has commented a post with id ${postId}`);
        res.json(comment);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

export {
    postRouter
}

