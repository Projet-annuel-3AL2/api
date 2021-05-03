import express from "express";
import {ProjectController} from "../controllers/project.controller";
import {ensureAdminLoggedIn} from "../middlewares/auth.middleware";
import {User} from "../models/user.model";

const projectRouter = express.Router();

projectRouter.post("/", ensureAdminLoggedIn, async (req, res) => {
    const projectController = await ProjectController.getInstance();
    try {
        const project = await projectController.create({...req.body}, req.user as User);
        res.json(project).status(200).end();
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

projectRouter.get("/", async (req, res) => {
    const projectController = await ProjectController.getInstance();
    try {
        const projects = await projectController.getAll();
        res.json(projects).end();
    } catch (err) {
        res.status(400).end();
    }
});

projectRouter.get("/:projectId", async (req, res) => {
    const projectId = req.params.projectId;
    const projectController = await ProjectController.getInstance();
    try {
        const project = await projectController.getById(projectId);
        res.json(project).end();
    } catch (err) {
        res.status(400).end();
    }
});

projectRouter.get("/:projectId/members", async (req, res) => {
    const projectId = req.params.projectId;
    const projectController = await ProjectController.getInstance();
    try {
        const members = await projectController.getProjectMembers(projectId);
        res.json(members).end();
    } catch (err) {
        res.status(400).end();
    }
});

projectRouter.get("/:projectId/admins", async (req, res) => {
    const projectId = req.params.projectId;
    const projectController = await ProjectController.getInstance();
    try {
        const admins = await projectController.getProjectAdmins(projectId);
        res.json(admins).end();
    } catch (err) {
        res.status(400).end();
    }
});

projectRouter.put("/:projectId/member/:userId", async (req, res) => {
    const projectId = req.params.projectId;
    const userId = req.params.userId;
    const projectController = await ProjectController.getInstance();
    try {
        const projectResult = await projectController.addProjectAdmin(projectId, userId);
        res.json(projectResult).end();
    } catch (err) {
        res.status(400).end();
    }
});

projectRouter.put("/:projectId/member/:userId", async (req, res) => {
    const projectId = req.params.projectId;
    const userId = req.params.userId;
    const projectController = await ProjectController.getInstance();
    try {
        const projectResult = await projectController.addProjectMember(projectId, userId);
        res.json(projectResult).status(200).end();
    } catch (err) {
        res.status(400).end();
    }
});


projectRouter.delete("/:projectId/member/:userId", async (req, res) => {
    const projectId = req.params.projectId;
    const userId = req.params.userId;
    const projectController = await ProjectController.getInstance();
    try {
        const projectResult = await projectController.removeProjectAdmin(projectId, userId);
        res.json(projectResult).status(200).end();
    } catch (err) {
        res.status(400).end();
    }
});

projectRouter.delete("/:projectId/member/:userId", async (req, res) => {
    const projectId = req.params.projectId;
    const userId = req.params.userId;
    const projectController = await ProjectController.getInstance();
    try {
        const projectResult = await projectController.removeProjectMember(projectId, userId);
        res.json(projectResult).status(200).end();
    } catch (err) {
        res.status(400).end();
    }
});

projectRouter.get("/:projectId/tickets", async (req, res) => {
    const projectId = req.params.projectId;
    const projectController = await ProjectController.getInstance();
    try {
        const tickets = await projectController.getTickets(projectId);
        res.json(tickets).status(200).end();
    } catch (err) {
        res.status(400).end();
    }
});


export {
    projectRouter
}
