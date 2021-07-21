import express from "express";
import {logger} from "../config/logging.config";
import {User} from "../models/user.model";
import {CommentController} from "../controllers/comment.controller";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {isCommentOwner} from "../middlewares/comment.middleware";

const commentRouter = express.Router();

commentRouter.delete("/:commentId",ensureLoggedIn, isCommentOwner, async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const commentController = CommentController.getInstance();
        await commentController.delete(commentId);
        logger.info(`User ${(req.user as User).username} deleted a comment with id ${commentId}`);
        res.status(204).end();
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

commentRouter.put("/:commentId/report", async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const userReporter = (req.user as User);
        const commentController = CommentController.getInstance();
        const reportedComment = await commentController.getById(commentId);
        const report = await commentController.reportComment(userReporter, reportedComment, {...req.body});
        logger.info(`User ${(req.user as User).username} has reported a comment with id ${commentId}`);
        res.json(report);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

export {
    commentRouter
}
