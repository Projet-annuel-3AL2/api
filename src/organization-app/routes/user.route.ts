import express from "express";
import {UserController} from "../controllers/user.controller";
import {ensureAdminLoggedIn} from "../middlewares/auth.middleware";

const userRouter = express.Router();

userRouter.post("/", ensureAdminLoggedIn, async (req, res) => {
    const userController = await UserController.getInstance();
    try{
        const user = await userController.create({...req.body});
        res.json(user);
    }catch (err) {
        res.status(400).json(err);
    }
});

userRouter.get("/", async (req, res) => {
    const userController = await UserController.getInstance();
    res.json(await userController.getAll());
});

userRouter.get("/:userId", async (req, res) => {
    const userId = req.params.userId;
    const userController = await UserController.getInstance();
    try {
        const user = await userController.getById(userId);
        res.json(user);
    } catch (err) {
        res.status(400).json(err);
    }
});

userRouter.put("/set-admin/:userId", ensureAdminLoggedIn, async (req, res) => {
    const userId = req.params.userId;
    const admin: boolean = req.body.admin;
    const userController = await UserController.getInstance();
    try {
        const user = await userController.setAdmin(userId, admin);
        res.json(user);
    } catch (err) {
        res.status(400).json(err);
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
        res.json(projects);
    } catch (err) {
        console.log(err)
        res.status(404).end();
    }
});

userRouter.delete("/:userId", async (req, res) => {
    const userId = req.params.userId;
    const userController = await UserController.getInstance();
    try {
        await userController.delete(userId);
        res.status(204).end();
    } catch (err) {
        res.status(400).end();
    }
});

userRouter.put("/:userId", async (req, res) => {
    const userId = req.params.userId;
    const userController = await UserController.getInstance();
    try {
        const user = await userController.update(userId, {...req.body});
        res.json(user);
    } catch (err) {
        res.status(400).end();
    }
});

export {
    userRouter
};
