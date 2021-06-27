import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {PostController} from "../controllers/post.controller";
import {User} from "../models/user.model";
import {OrganisationController} from "../controllers/organisation.controller";

const postRouter = express.Router();

postRouter.post('/', ensureLoggedIn, async (req, res) => {
    try {
        const postController = await PostController.getInstance();
        const post = await postController.create(req.user as User, req.body);
        res.status(200).json(post);
    } catch (err) {
        res.status(400).json(err);
    }
});

postRouter.get('/', async (req, res) => {
    try {
        const postController = await PostController.getInstance();
        const post = await postController.getAll();
        res.status(200).json(post);
    } catch (err) {
        res.status(400).json(err);
    }
});

postRouter.get('/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const postController = await PostController.getInstance();
        const post = await postController.getById(postId);
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json(err);
    }
});

postRouter.delete('/:postId', ensureLoggedIn, async (req, res) => {
    try {
        const postId = req.params.postId;
        const postController = await PostController.getInstance();
        const post = await postController.delete(postId);
        res.status(200).json(post);
    } catch (err) {
        res.status(400).json(err);
    }
});

postRouter.put('/:postId', ensureLoggedIn, async (req, res) => {
    try {
        const postId = req.params.postId;
        const postController = await PostController.getInstance();
        const post = await postController.update(postId, {...req.body});
        res.status(200).json(post);
    } catch (err) {
        res.status(400).json(err);
    }
});

postRouter.get("/:postId/likes", async (req, res) => {
    try {
        const postId = req.params.postId;
        const postController = await PostController.getInstance();
        const likes = await postController.getLikes(postId)
        res.status(200).json(likes);
    } catch (err) {
        res.status(400).json(err);
    }
});

postRouter.get("/timeline/:userId/:offset/:limit", async (req, res) => {
    try{
        const offset=parseInt(req.params.offset);
        const limit=parseInt(req.params.limit);
        const userId= req.params.userId;
        const postController = await PostController.getInstance();
        const posts = await postController.getTimeline(userId, offset, limit);
        console.log(posts)
        res.status(200).json(posts);
    }catch (err) {
        console.log(err)
        res.status(400).json(err);
    }
});

postRouter.get('/getPostsOrganisation/:organisationName', async (req, res) => {
    try {
        const organisationName = req.params.organisationName;
        const postController = await PostController.getInstance();
        const organisationController = await OrganisationController.getInstance();
        const organisation = await organisationController.getByName(organisationName);
        const post = await postController.getAllWithOrgaId(organisation);
        res.status(200).json(post);

    } catch (err) {
        res.status(400).json(err);
    }
});

export {
    postRouter
}

