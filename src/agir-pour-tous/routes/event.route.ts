import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {User} from "../models/user.model";
import {EventController} from "../controllers/event.controller";
import {hasAdminRights} from "../middlewares/user.middleware";
import {canCreateEvent, isEventOrganiser} from "../middlewares/event.middleware";
import {logger} from "../config/logging.config";
import {MediaController} from "../controllers/media.controller";
import {upload} from "./index.route";
import {arePicturesFiles} from "../middlewares/media.middleware";
import {Media} from "../models/media.model";

const eventRouter = express.Router();

eventRouter.post('/', ensureLoggedIn, canCreateEvent, upload.single("event_media"), arePicturesFiles, async (req, res) => {
    try {
        const eventController = await EventController.getInstance();
        const mediaController = await MediaController.getInstance();
        let media: Media;
        if (req.file) {
            media = await mediaController.create(req.file);
        }

        const event = await eventController.create(req.user as User, {...req.body, media});
        res.json(event);
    } catch (err) {
        logger.error(err);
        res.status(400).json(err);
    }
});


eventRouter.post('/:eventId/join', ensureLoggedIn, async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const userId = (req.user as User).id;
        const eventController = await EventController.getInstance();
        await eventController.addParticipant(eventId, userId);
        res.status(204).end();
    } catch (err) {
        logger.error(err);
        res.status(400).json(err);
    }
});

eventRouter.get('/', async (req, res) => {
    try {
        const eventController = await EventController.getInstance();
        const event = await eventController.getAll();
        res.json(event);
    } catch (err) {
        logger.error(err);
        res.status(400).json(err);
    }
});

eventRouter.get('/suggestions/events', async (req, res) => {
    try {
        const eventController = await EventController.getInstance();
        const events = await eventController.getSuggestion();
        res.json(events);
    } catch (err) {
        logger.error(err);
        res.status(404).json(err);
    }
});

eventRouter.get('/is-finished', async (req, res) => {
    try {
        const eventController = await EventController.getInstance();
        const events = await eventController.getAllNotEnd();
        res.json(events);
    } catch (err) {
        logger.error(err);
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
        logger.error(err);
        res.status(400).json(err);
    }
});

eventRouter.get('/:eventId/participants', async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const eventController = await EventController.getInstance();
        const event = await eventController.getEventMembers(eventId);
        res.status(200).json(event);
    } catch (err) {
        logger.error(err);
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
        logger.error(err);
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
        logger.error(err);
        res.status(400).json(err);
    }
});

eventRouter.get('/search/:name', async (req, res) => {
    try {
        const name = req.params.name;
        const eventController = await EventController.getInstance();
        const events = await eventController.searchByName(name);
        res.json(events)
    } catch (err) {
        logger.error(err);
        res.status(400).json(err);
    }
})

eventRouter.get('/:eventId/participants', async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const eventController = await EventController.getInstance();
        const event = await eventController.getEventMembers(eventId);
        res.status(200).json(event);
    } catch (err) {
        logger.error(err);
        res.status(400).json(err);
    }
});

// TODO: Authorizer les admins pour deleteEvent
eventRouter.delete('/:eventId', ensureLoggedIn, isEventOrganiser, async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const eventController = await EventController.getInstance();
        await eventController.delete(eventId);
        res.status(204).end();
    } catch (err) {
        logger.error(err);
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
        logger.error(err);
        res.status(400).json(err);
    }
});


eventRouter.delete('/:eventId/participant/:userId', ensureLoggedIn, async (req, res) => {
    try {
        const userId = req.params.userId;
        const eventId = req.params.eventId;
        const eventController = await EventController.getInstance();
        await eventController.removeParticipant(eventId, userId);
        res.status(204).end();
    } catch (err) {
        logger.error(err);
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
        logger.error(err);
        res.status(400).json(err);
    }
});

eventRouter.get('/:eventId/owner', async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const eventController = EventController.getInstance();
        const owners = await eventController.getOwners(eventId);
        res.json(owners);
    } catch (err) {
        logger.error(err);
        res.status(404).json(err);
    }
});

eventRouter.get('/:eventId/profil', async (req, res) => {
    try {
        const eventController = await EventController.getInstance();
        const events = await eventController.getProfil(req.params.eventId);
        res.json(events);
    } catch (err) {
        logger.error(err);
        res.status(400).json(err);
    }
});

eventRouter.get('/:eventId/category', async (req, res) => {
    try {
        const eventController = await EventController.getInstance();
        const events = await eventController.getCategory(req.params.eventId);
        res.json(events);
    } catch (err) {
        logger.error(err);
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
        logger.error(err);
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
        logger.error(err);
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
        logger.error(err);
        res.status(400).json(err);
    }
});

eventRouter.get('/:eventId/category', async (req, res) => {
    try {
        const eventController = await EventController.getInstance();
        const category = await eventController.getCategory(req.params.eventId);
        res.json(category);
    } catch (err) {
        logger.error(err);
        res.status(404).json(err);
    }
});

eventRouter.get('/:eventId/organisation', async (req, res) => {
    try {
        const eventController = await EventController.getInstance();
        const organisation = await eventController.getOrganisation(req.params.eventId);
        res.json(organisation);
    } catch (err) {
        logger.error(err);
        res.status(404).json(err);
    }
});

export {
    eventRouter
}
