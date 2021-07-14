import express from "express";
import {CategoryController} from "../controllers/category.controller";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {hasAdminRights} from "../middlewares/user.middleware";
import {logger} from "../config/logging.config";

const categoryRouter = express.Router();

categoryRouter.post("/", ensureLoggedIn, hasAdminRights, async (req, res) => {
    try {
        const categoryController = CategoryController.getInstance();
        const category = await categoryController.create(req.body);
        res.json(category);
    } catch (err) {
        logger.error(err);
        res.status(404).json(err);
    }
});

categoryRouter.get("/", async (req, res) => {
    try {
        const categoryController = await CategoryController.getInstance();
        const category = await categoryController.getAll();
        res.json(category);
    } catch (err) {
        logger.error(err);
        res.status(404).json(err);
    }
});

categoryRouter.get("/:categoryId", async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const categoryController = CategoryController.getInstance();
        const category = await categoryController.getById(categoryId);
        res.json(category);
    } catch (err) {
        logger.error(err);
        res.status(404).json(err);
    }
});

categoryRouter.put("/:categoryId", ensureLoggedIn, hasAdminRights, async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const categoryController = CategoryController.getInstance();
        const category = await categoryController.update(categoryId, {...req.body});
        res.json(category);
    } catch (err) {
        logger.error(err);
        res.status(400).json(err);
    }
});

categoryRouter.delete("/:categoryId", ensureLoggedIn, hasAdminRights, async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const categoryController = CategoryController.getInstance();
        const category = await categoryController.delete(categoryId);
        res.json(category);
    } catch (err) {
        logger.error(err);
        res.status(400).json(err);
    }
});

categoryRouter.get("/:categoryId/events", async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const categoryController = CategoryController.getInstance();
        const events = categoryController.getEvents(categoryId);
        res.json(events);
    } catch (err) {
        logger.error(err);
        res.status(400).json(err);
    }
});

export {
    categoryRouter
}

