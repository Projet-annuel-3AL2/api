import express from "express";
import {logger} from "../config/logging.config";
import {MediaController} from "../controllers/media.controller";

const mediaRouter = express.Router();

/*mediaRouter.get("/user/profilePicture/:username",async (req, res) => {
    try {
        const username = req.params.username;
        const mediaController = MediaController.getInstance();
        const media = await mediaController.getUserProfilePicture(username);
        res.json(media);
    } catch (err) {
        logger.error(err);
        res.status(404).json(err);
    }
});

mediaRouter.get("/user/bannerPicture/:username",async (req, res) => {
    try {
        const username = req.params.username;
        const mediaController = MediaController.getInstance();
        const media = await mediaController.getUserbannerPicture(username);
        res.json(media);
    } catch (err) {
        logger.error(err);
        res.status(404).json(err);
    }
});*/

mediaRouter.get("/post/:postId",async (req, res) => {
    try {
        const postId = req.params.postId;
        const mediaController = MediaController.getInstance();
        const media = await mediaController.getPostMedias(postId);
        res.json(media);
    } catch (err) {
        logger.error(err);
        res.status(404).json(err);
    }
});

export {
    mediaRouter
}
