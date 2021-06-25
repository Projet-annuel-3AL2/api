import express from "express";
import {CategoryController} from "../controllers/category.controller";
import {ensureLoggedIn} from "../middlewares/auth.middleware";

const categoryRouter = express.Router();

categoryRouter.post("/", ensureLoggedIn, async (req, res) => {
    try {
        const categoryController = CategoryController.getInstance();
        const category = categoryController.create(req.body);
        res.json(category);
    } catch (err) {
        res.status(404).json(err);
    }
});

categoryRouter.get("/", async (req, res) => {
    try {
        const categoryController = await CategoryController.getInstance();
        const category = await categoryController.getAll();
        res.status(200).json(category);
    } catch (err) {
        res.status(404).json(err);
    }
});

categoryRouter.get("/:categoryId", async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const categoryController = CategoryController.getInstance();
        const category = categoryController.getById(categoryId);
        res.json(category);
    } catch (err) {
        res.status(404).json(err);
    }
});

categoryRouter.put("/:categoryId", async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const categoryController = CategoryController.getInstance();
        const category = categoryController.update(categoryId, {...req.body});
        res.json(category);
    } catch (err) {
        res.status(400).json(err);
    }
});

categoryRouter.delete("/:categoryId", async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const categoryController = CategoryController.getInstance();
        const category = categoryController.delete(categoryId);
        res.json(category);
    } catch (err) {
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
        res.status(400).json(err);
    }
});

export {
    categoryRouter
}

