import express from "express";
import {CategoryController} from "../controllers/category.controller";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {hasAdminRights} from "../middlewares/user.middleware";
import {logger} from "../config/logging.config";
import {User} from "../models/user.model";

const categoryRouter = express.Router();

categoryRouter.post("/", ensureLoggedIn, hasAdminRights, async (req, res) => {
    try {
        const categoryController = CategoryController.getInstance();
        const category = await categoryController.create(req.body);
        logger.info(`User ${(req.user as User).username} created new category named ${req.body.name}`);
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
        logger.info(`User ${(req.user as User).username} modified category named ${category.name}`);
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
        await categoryController.delete(categoryId);
        logger.info(`User ${(req.user as User).username} deleted category with id ${categoryId}`);
        res.status(204).end();
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

