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
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(404).json(error);
    }
});

categoryRouter.get("/", async (req, res) => {
    try {
        const categoryController = await CategoryController.getInstance();
        const category = await categoryController.getAll();
        res.json(category);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(404).json(error);
    }
});

categoryRouter.get("/:categoryId", async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const categoryController = CategoryController.getInstance();
        const category = await categoryController.getById(categoryId);
        res.json(category);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(404).json(error);
    }
});

categoryRouter.put("/:categoryId", ensureLoggedIn, hasAdminRights, async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const categoryController = CategoryController.getInstance();
        const category = await categoryController.update(categoryId, {...req.body});
        res.json(category);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

categoryRouter.delete("/:categoryId", ensureLoggedIn, hasAdminRights, async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const categoryController = CategoryController.getInstance();
        const category = await categoryController.delete(categoryId);
        res.json(category);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

categoryRouter.get("/:categoryId/events", async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const categoryController = CategoryController.getInstance();
        const events = categoryController.getEvents(categoryId);
        res.json(events);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

export {
    categoryRouter
}

