import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {User} from "../models/user.model";
import {EventController} from "../controllers/event.controller";
import {hasAdminRights} from "../middlewares/user.middleware";
import {isEventOrganiser} from "../middlewares/event.middleware";

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


eventRouter.get('/:eventId/join', ensureLoggedIn, async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const userId = (req.user as User).id;
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
        const event = await eventController.getAll();
        res.json(event);
    } catch (err) {
        res.status(400).json(err);
    }
});

eventRouter.get('/is-finished', ensureLoggedIn, async (req, res) => {
    try {
        const eventController = await EventController.getInstance();
        const events = await eventController.getAllNotEnd();
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
        res.status(200).json(event);
    } catch (err) {
        res.status(400).json(err);
    }
});

eventRouter.get('/:eventId/getMembers', async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const eventController = await EventController.getInstance();
        const event = await eventController.getEventMembers(eventId);
        res.status(200).json(event);
    } catch (err) {
        res.status(400).json(err);
    }
});

eventRouter.get('/getEventWithUserLocation/:userLocationX/:userLocationY/:range', async (req, res) => {
    try {
        const userLocationX = req.params.userLocationX;
        const userLocationY = req.params.userLocationY;
        const range = req.params.range;
        const eventController = await EventController.getInstance();
        let events = await eventController.getEventWithLocation(Number(userLocationX), Number(userLocationY), Number(range));
        res.json(events);
    } catch (err) {
        res.status(400).json(err);
    }
});

eventRouter.get('/getEventWithUserLocationNotEnd/:userLocationX/:userLocationY/:range', async (req, res) => {
    try {
        const userLocationX = req.params.userLocationX;
        const userLocationY = req.params.userLocationY;
        const range = req.params.range;
        const eventController = await EventController.getInstance();
        let events = await eventController.getEventWithLocationNotEnd(Number(userLocationX), Number(userLocationY), Number(range));
        res.status(200).json(events);
    } catch (err) {
        res.status(400).json(err);
    }
});

eventRouter.get('/search/:name', ensureLoggedIn, async (req, res) => {
    try {
        const name = req.params.name;
        const eventController = await EventController.getInstance();
        const events = await eventController.searchByName(name);
        res.json(events)
    } catch (err) {
        res.status(400).json(err);
    }
})

eventRouter.delete('/:eventId', ensureLoggedIn, isEventOrganiser, async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const eventController = await EventController.getInstance();
        await eventController.delete(eventId);
        res.status(204).end();
    } catch (err) {
        res.status(400).json(err);
    }
});

eventRouter.delete('/:eventId/participant', ensureLoggedIn, async (req, res) => {
    try {
        const userId = (req.user as User).id;
        const eventId = req.params.eventId;
        const eventController = await EventController.getInstance();
        await eventController.removeParticipant(eventId, userId);
        res.status(204).end();
    } catch (err) {
        res.status(400).json(err);
    }
});

eventRouter.put('/:eventId', ensureLoggedIn, isEventOrganiser, async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const eventController = EventController.getInstance();
        const event = await eventController.update(eventId, {...req.body});
        res.json(event);
    } catch (err) {
        res.status(400).json(err);
    }
});

eventRouter.get('/:eventId/posts', async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const eventController = await EventController.getInstance();
        const posts = await eventController.getPosts(eventId);
        res.json(posts);
    } catch (err) {
        res.status(400).json(err);
    }
});

eventRouter.put("/:eventId/report", ensureLoggedIn, async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const userReporter = req.user as User;
        const eventController = EventController.getInstance();
        const reportedEvent = await eventController.getById(eventId);
        const report = await eventController.reportEvent(userReporter, reportedEvent, {...req.body});
        res.json(report);
    } catch (err) {
        res.status(400).json(err);
    }
});

eventRouter.get("/:eventId/reports", ensureLoggedIn, hasAdminRights, async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const eventController = EventController.getInstance();
        const reports = await eventController.getReports(eventId);
        res.json(reports);
    } catch (err) {
        res.status(400).json(err);
    }
});

eventRouter.get('/:organisationId/owner', ensureLoggedIn, async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const eventController = EventController.getInstance();
        const owners = await eventController.getOwners(eventId);
        res.json(owners);
    } catch (err) {
        res.status(404).json(err);
    }
});

export {
    eventRouter
}
