import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {User} from "../models/user.model";
import {EventController} from "../controllers/event.controller";

const eventRouter = express.Router();

eventRouter.post('/', ensureLoggedIn, async (req, res) => {
    try {
        const eventController = await EventController.getInstance();
        const event = await eventController.create(req.user as User, req.body);
        res.json(event);
    } catch (err) {
        res.status(400).json(err);
    }
});

eventRouter.post('/:eventId/participant/:userId', ensureLoggedIn, async (req, res) => {
    try {
        const userId = req.params.userId;
        const eventId = req.params.eventId;
        const eventController = await EventController.getInstance();
        const event = await eventController.addParticipant(eventId, userId);
        res.json(event);
    } catch (err) {
        res.status(400).json(err);
    }
});

eventRouter.get('/', ensureLoggedIn, async (req, res) => {
    try {
        const eventController = await EventController.getInstance();
        const events = await eventController.getAll();
        res.json(events);
    } catch (err) {
        res.status(400).json(err);
    }
});

eventRouter.get('/:eventId', async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const eventController = await EventController.getInstance();
        const event = await eventController.getById(eventId);
        res.json(event);
    } catch (err) {
        res.status(400).json(err);
    }
});

eventRouter.get('/getWithUserLocation', ensureLoggedIn, async (req, res) => {
    try {
        const userLongitude = req.body.userLongitude;
        const userLatitude = req.body.userLatitude;
        const range = req.body.range;
        const eventController = await EventController.getInstance();
        let events = await eventController.getEventWithLocation(userLongitude, userLatitude, range);
        res.json(events);
    } catch (err) {
        res.status(400).json(err);
    }
});

eventRouter.get('/userRecherche/:userRecherche', ensureLoggedIn, async (req, res) => {
    try {
        const eventController = await EventController.getInstance();
        const events = await eventController.getByName(req.params.userRecherche)
        res.json(events)
    } catch (err) {
        res.status(400).json(err);
    }
})

eventRouter.delete('/:eventId', ensureLoggedIn, async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const eventController = await EventController.getInstance();
        await eventController.delete(eventId);
        res.status(204).end();
    } catch (err) {
        res.status(400).json(err);
    }
});

eventRouter.delete('/participant/:userId', ensureLoggedIn, async (req, res) => {
    try {
        const userId = req.params.userId;
        const eventController = await EventController.getInstance();
        await eventController.removeParticipant(req.body.eventId, userId);
        res.status(204).end();
    } catch (err) {
        res.status(400).json(err);
    }
});

eventRouter.put('/:eventId', ensureLoggedIn, async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const eventController = await EventController.getInstance();
        const event = await eventController.update(eventId, {...req.body});
        res.json(event);
    } catch (err) {
        res.status(400).json(err);
    }
});


export {
    eventRouter
}
