import express from "express";
import {TicketController} from "../controllers/ticket.controller";
import {UserController} from "../controllers/user.controller";

const ticketRouter = express.Router();

ticketRouter.get("/", async (req, res) => {
    const ticketController = await TicketController.getInstance();
    try {
        const tickets = await ticketController.getAll();
        res.json(tickets);
    } catch (err) {
        res.status(400).end();
    }
});

ticketRouter.get("/:ticketId", async (req, res) => {
    const ticketId = req.params.ticketId;
    const ticketController = await TicketController.getInstance();
    try {
        const ticket = await ticketController.getById(ticketId);
        res.json(ticket);
    } catch (err) {
        res.status(400).end();
    }
});

ticketRouter.delete("/:ticketId", async (req, res) => {
    const ticketId = req.params.ticketId;
    const ticketController = await TicketController.getInstance();
    try {
        await ticketController.deleteTicket(ticketId);
        res.status(204).end();
    } catch (err) {
        res.status(400).end();
    }
});

ticketRouter.put("/:ticketId", async (req, res) => {
    const ticketId = req.params.ticketId;
    const ticketController = await TicketController.getInstance();
    try {
        const ticket = await ticketController.updateTicket(ticketId, {...req.body});
        res.json(ticket);
    } catch (err) {
        res.status(400).end();
    }
});

ticketRouter.put("/:ticketId/assignee/:userId", async (req, res) => {
    const ticketId = req.params.ticketId;
    const userId = req.params.userId;
    const ticketController = await TicketController.getInstance();
    const userController = await UserController.getInstance();
    try {
        const user = await userController.getById(userId);
        const ticket = await ticketController.setAssignee(ticketId, user);
        res.json(ticket);
    } catch (err) {
        res.status(400).end();
    }
});

export {
    ticketRouter
}