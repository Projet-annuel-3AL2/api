import express from "express";
import {SearchController} from "../controllers/search.controller";

const searchRouter = express.Router();

searchRouter.get("/:data", async (req, res) => {
    try {
        const data = req.params.data;
        const searchController = SearchController.getInstance();
        const result = await searchController.search(data);
        res.json(result);
    } catch (err) {
        res.status(400).json(err);
    }
});

export {
    searchRouter
}

