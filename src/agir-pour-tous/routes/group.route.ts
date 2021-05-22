import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {isAskedUser} from "../middlewares/user.middleware";
import {GroupController} from "../controllers/group.controller";

const groupRouter = express.Router();

groupRouter.get('/',  async (req, res) => {
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
        const group = await groupController.getByGroupName(groupName);
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
        const posts = groupController.getPosts(groupName)
        res.json(posts);
    } catch (err) {
        res.status(400).json(err);
    }
});


export {
    groupRouter
}
