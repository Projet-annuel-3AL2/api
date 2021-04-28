import express from "express";
import {ProjectController} from "../controllers/project.controller";
import {ensureAdminLoggedIn} from "../middlewares/auth.middleware";
import {User} from "../models/user.model";

const projectRouter = express.Router();

projectRouter.post("/", ensureAdminLoggedIn, async (req, res) => {
    const projectController = await ProjectController.getInstance();
    try {
        const project = await projectController.create({...req.body}, req.user as User);
        res.json(project);
    } catch (err) {
        res.status(400).end();
    }
});

projectRouter.delete("/:projectId", ensureAdminLoggedIn, async (req, res) => {
    const projectId = req.params.projectId;
    const projectController = await ProjectController.getInstance();
    try {
        await projectController.delete(projectId);
        res.status(204).end();
    } catch (err) {
        res.status(400).end();
    }
});

export {
    projectRouter
}
