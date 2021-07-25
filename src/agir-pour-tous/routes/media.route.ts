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
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(404).json(error);
    }
});

mediaRouter.get("/user/bannerPicture/:username",async (req, res) => {
    try {
        const username = req.params.username;
        const mediaController = MediaController.getInstance();
        const media = await mediaController.getUserbannerPicture(username);
        res.json(media);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(404).json(error);
    }
});*/

mediaRouter.get("/post/:postId", async (req, res) => {
    try {
        const postId = req.params.postId;
        const mediaController = MediaController.getInstance();
        const media = await mediaController.getPostMedias(postId);
        res.json(media);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(404).json(error);
    }
});

export {
    mediaRouter
}
