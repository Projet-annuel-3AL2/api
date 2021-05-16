import express from "express";
import {CommentController} from "../controllers/comment.controller";

const commentRouter = express.Router();


commentRouter.get("/", async (req, res) => {
    const commentController = await CommentController.getInstance();
    try {
        const comments = await commentController.getAll();
        res.json(comments).end();
    } catch (err) {
        res.status(400).end();
    }
});


commentRouter.put("/:commentId", async (req, res) => {
    const commentId = req.params.commentId;
    const commentController = await CommentController.getInstance();
    try {
        const comment = await commentController.update(commentId, {...req.body});
        res.json(comment);
    } catch (err) {
        res.status(400).end();
    }
});

commentRouter.get("/:commentId", async (req, res) => {
    const commentId = req.params.commentId;
    if (commentId === undefined) {
        res.status(400).end();
    }
    const commentController = await CommentController.getInstance();
    try {
        const comment = await commentController.getById(commentId);
        res.json(comment);
    } catch (err) {
        res.status(404).end();
    }
});

commentRouter.delete("/:commentId", async (req, res) => {
    const commentId = req.params.commentId;
    const commentController = await CommentController.getInstance();
    try {
        await commentController.delete(commentId);
        res.status(204).end();
    } catch (err) {
        res.status(400).end();
    }
});

export {
    commentRouter
}
