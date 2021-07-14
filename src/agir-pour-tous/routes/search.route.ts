import express from "express";
import {SearchController} from "../controllers/search.controller";
import {logger} from "../config/logging.config";

const searchRouter = express.Router();

searchRouter.get("/:data", async (req, res) => {
    try {
        const data = req.params.data;
        const searchController = SearchController.getInstance();
        const result = await searchController.search('%' + data + '%');
        res.json(result);
    } catch (err) {
        logger.error(err);
        res.status(400).json(err);
    }
});

searchRouter.get("/:data/event", async (req, res) => {
    try {
        const data = req.params.data;
        const searchController = SearchController.getInstance();
        const result = await searchController.getEvents('%' + data + '%');
        res.json(result);
    } catch (err) {
        logger.error(err);
        res.status(400).json(err);
    }
});

export {
    searchRouter
}

