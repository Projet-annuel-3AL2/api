import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {User} from "../models/user.model";
import {EventController} from "../controllers/event.controller";
import {PostController} from "../controllers/post.controller";

const eventRouter = express.Router();

eventRouter.post('/', ensureLoggedIn, async (req, res) => {
    try {
        const eventController = await EventController.getInstance();
        const event = eventController.create(req.user as User, req.body);
        res.json(event);
    } catch (err) {
        res.status(400).json(err);
    }
});

eventRouter.post('/addParticipant', ensureLoggedIn, async (req, res) => {
    try {
        const eventController = await EventController.getInstance();
        const event = eventController.addParticipant(req.body.eventId, req.body.userId);
        res.json(event);
    } catch (err) {
        res.status(400).json(err);
    }
});

eventRouter.get('/', async (req, res) => {
    try {
        const eventController = await EventController.getInstance();
        const event = eventController.getAll();
        res.json(event);
    } catch (err) {
        res.status(400).json(err);
    }
});

eventRouter.get('/:eventId', async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const eventController = await EventController.getInstance();
        const event = eventController.getById(eventId);
        res.json(event);
    } catch (err) {
        res.status(400).json(err);
    }
});

eventRouter.delete('/:eventId', async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const eventController = await EventController.getInstance();
        const event = eventController.delete(eventId);
        res.json(event);
    } catch (err) {
        res.status(400).json(err);
    }
});

eventRouter.delete('/participant/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const eventController = await EventController.getInstance();
        const event = eventController.removeParticipant(req.body.eventId, userId);
        res.json(event);
    } catch (err) {
        res.status(400).json(err);
    }
});

eventRouter.put('/:eventId', async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const eventController = await EventController.getInstance();
        const event = eventController.update(eventId, {...req.body});
        res.json(event);
    } catch (err) {
        res.status(400).json(err);
    }
});


export {
    eventRouter
}
