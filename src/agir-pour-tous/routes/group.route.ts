import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {isAskedUser} from "../middlewares/user.middleware";
import {GroupController} from "../controllers/group.controller";
import {User} from "../models/user.model";

const groupRouter = express.Router();

groupRouter.post('/', ensureLoggedIn, async (req, res) => {
    try {
        const groupController = GroupController.getInstance();
        const group = await groupController.create(req.user as User, req.body);
        res.json(group);
    } catch (err) {
        res.status(400).json(err);
    }
});


groupRouter.get('/', async (req, res) => {
    try {
        const groupController = GroupController.getInstance();
        const groups = await groupController.getAll();
        res.json(groups);
    } catch (err) {
        res.status(400).json(err);
    }
});

groupRouter.get('/:groupName', async (req, res) => {
    try {
        const groupName = req.params.groupName;
        const groupController = GroupController.getInstance();
        const group = await groupController.getByName(groupName);
        res.json(group);
    } catch (err) {
        res.status(404).json(err);
    }
});

groupRouter.delete('/:groupName', ensureLoggedIn, async (req, res) => {
    try {
        const groupName = req.params.groupName;
        const groupController = GroupController.getInstance();
        await groupController.delete(groupName);
        res.status(204).end();
    } catch (err) {
        res.status(400).json(err);
    }
});

groupRouter.put('/:groupName', ensureLoggedIn, isAskedUser, async (req, res) => {
    try {
        const groupName = req.params.groupName;
        const groupController = GroupController.getInstance();
        await groupController.update(groupName, {...req.body});
        res.status(204).end();
    } catch (err) {
        res.status(400).json(err);
    }
});

groupRouter.get("/:groupName/posts", async (req, res) => {
    try {
        const groupName = req.params.groupName;
        const groupController = GroupController.getInstance();
        const posts = await groupController.getPosts(groupName)
        res.json(posts);
    } catch (err) {
        res.status(400).json(err);
    }
});

groupRouter.post("/:groupName/posts", async (req, res) => {
    try {
        const groupName = req.params.groupName;
        const groupController = GroupController.getInstance();
        const group = await groupController.getByName(groupName);
        const post = await groupController.addPost(group, req.user as User, req.body)
        res.json(post);
    } catch (err) {
        res.status(400).json(err);
    }
});

export {
    groupRouter
}
