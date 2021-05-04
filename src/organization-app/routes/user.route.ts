import express from "express";
import {UserController} from "../controllers/user.controller";
import {ensureAdminLoggedIn} from "../middlewares/auth.middleware";

const userRouter = express.Router();

userRouter.get("/", async (req, res) => {
    const userController = await UserController.getInstance();
    res.json(await userController.getAll());
});

userRouter.get("/:userId", async (req, res) => {
    const userId = req.params.userId;
    if (userId === undefined) {
        res.status(400).end();
    }
    const userController = await UserController.getInstance();
    try {
        const user = await userController.getById(userId);
        res.json(user);
    } catch (err) {
        res.status(404).end();
    }
});

userRouter.put("/set-admin/:userId", ensureAdminLoggedIn, async (req, res) => {
    const userId = req.params.userId;
    const admin: boolean = req.body.admin;
    const userController = await UserController.getInstance();
    try {
        const user = await userController.setAdmin(userId, admin);
        res.json(user).status(200).end();
    } catch (err) {
        res.status(400).end();
    }
});

userRouter.get("/:userId/projects", async (req, res) => {
    const userId = req.params.userId;
    if (userId === undefined) {
        res.status(400).end();
    }
    const userController = await UserController.getInstance();
    try {
        const projects = await userController.getProjects(userId);
        res.json(projects).status(200).end();
    } catch (err) {
        res.status(404).end();
    }
});

export {
    userRouter
};
