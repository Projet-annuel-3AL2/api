import express from "express";
import {SearchController} from "../controllers/search.controller";
import {logger} from "../config/logging.config";
import {User} from "../models/user.model";

const searchRouter = express.Router();

searchRouter.get("/:data", async (req, res) => {
    try {
        const data = req.params.data;
        const searchController = SearchController.getInstance();
        const result = await searchController.search('%' + data + '%');
        logger.info(`User ${(req.user as User).username} has searched ${data}`);
        res.json(result);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

searchRouter.get("/:data/event", async (req, res) => {
    try {
        const data = req.params.data;
        const searchController = SearchController.getInstance();
        const result = await searchController.getEvents('%' + data + '%');
        logger.info(`User ${(req.user as User).username} has searched an event containing ${data}`);
        res.json(result);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

export {
    searchRouter
}

