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

projectRouter.put("/:projectId/admin/:userId", async (req, res) => {
    const projectId = req.params.projectId;
    const userId = req.params.userId;
    const projectController = await ProjectController.getInstance();
    try {
        await projectController.addProjectAdmin(projectId, userId);
        res.status(204).end();
    } catch (err) {
        res.status(400).end();
    }
});

projectRouter.put("/:projectId/member/:userId", async (req, res) => {
    const projectId = req.params.projectId;
    const userId = req.params.userId;
    const projectController = await ProjectController.getInstance();
    try {
        await projectController.addProjectMember(projectId, userId);
        res.status(204).end();
    } catch (err) {
        res.status(400).end();
    }
});

projectRouter.put("/:projectId/member", async (req, res) => {
    const projectId = req.params.projectId;
    const userIds = req.body.users;
    const projectController = await ProjectController.getInstance();
    try {
         for (const userId of userIds) {
             await projectController.addProjectMember(projectId, userId);
         }
        res.status(204).end();
    } catch (err) {
        res.status(400).end();
    }
});

projectRouter.delete("/:projectId/admin/:userId", async (req, res) => {
    const projectId = req.params.projectId;
    const userId = req.params.userId;
    const projectController = await ProjectController.getInstance();
    try {
        await projectController.removeProjectAdmin(projectId, userId);
        res.status(204).end();
    } catch (err) {
        res.status(400).end();
    }
});

projectRouter.delete("/:projectId/member/:userId", async (req, res) => {
    const projectId = req.params.projectId;
    const userId = req.params.userId;
    const projectController = await ProjectController.getInstance();
    try {
        await projectController.removeProjectMember(projectId, userId);
        res.status(204).end();
    } catch (err) {
        res.status(400).end();
    }
});

projectRouter.delete("/:projectId/member", async (req, res) => {
    const projectId = req.params.projectId;
    const userIds = req.body.users;
    console.log(userIds)
    const projectController = await ProjectController.getInstance();
    try {
        for (const userId of userIds) {
            await projectController.removeProjectMember(projectId, userId);
        }
        res.status(204).end();
    } catch (err) {
        res.status(400).end();
    }
});

projectRouter.get("/:projectId/tickets", async (req, res) => {
    const projectId = req.params.projectId;
    const projectController = await ProjectController.getInstance();
    try {
        const tickets = await projectController.getTickets(projectId);
        res.json(tickets).end();
    } catch (err) {
        res.status(400).end();
    }
});

projectRouter.post("/:projectId/ticket", async (req, res) => {
    const projectId = req.params.projectId;
    const projectController = await ProjectController.getInstance();
    try {
        console.log(req.body)
        const ticket = await projectController.addTicket(projectId, {...req.body});
        res.json(ticket);
    } catch (err) {
        res.status(400).end();
    }
});

export {
    projectRouter
}
