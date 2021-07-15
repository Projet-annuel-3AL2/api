import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {User} from "../models/user.model";
import {EventController} from "../controllers/event.controller";
import {hasAdminRights} from "../middlewares/user.middleware";
import {
    canCreateEvent,
    isEventOrganiser,
    isMember,
    isNotEventOrganiser,
    isNotMember
} from "../middlewares/event.middleware";
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
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});


eventRouter.post('/:eventId/join', ensureLoggedIn, isNotEventOrganiser, isNotMember, async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const userId = (req.user as User).id;
        const eventController = await EventController.getInstance();
        const event = await eventController.addParticipant(eventId, userId);
        logger.info(`User ${(req.user as User).username} joined event with id ${eventId}`);
        res.json(event);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
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
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

eventRouter.get('/suggestions/events', async (req, res) => {
    try {
        const eventController = await EventController.getInstance();
        const events = await eventController.getSuggestion();
        res.json(events);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(404).json(error);
    }
});

eventRouter.get('/:eventId/is-member', async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const eventController = EventController.getInstance();
        const isMember = await eventController.isMember((req.user as User).id,eventId);
        res.json(isMember);
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
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

eventRouter.get('/:eventId', async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const eventController = await EventController.getInstance();
        const event = await eventController.getById(eventId);
        res.status(200).json(event);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

eventRouter.get('/:eventId/participants', async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const eventController = await EventController.getInstance();
        const event = await eventController.getEventMembers(eventId);
        res.status(200).json(event);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

eventRouter.get('/search/:userLocationX/:userLocationY/:range/:startDate/:endDate/:categoryId', async (req, res) => {
    try {
        const userLocationX = req.params.userLocationX;
        const userLocationY = req.params.userLocationY;
        const range = req.params.range;
        const startDate = req.params.startDate;
        const endDate = req.params.endDate;
        const categoryId = req.params.categoryId;
        const eventController = await EventController.getInstance();
        const events = await eventController.getEventsSearch(userLocationX, userLocationY, range, startDate, endDate,categoryId);
        res.json(events);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
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
        logger.info(`User ${(req.user as User).username} deleted event with id ${eventId}`);
        res.status(204).end();
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

eventRouter.delete('/:eventId/participant/:userId', ensureLoggedIn, async (req, res) => {
    try {
        const userId = req.params.userId;
        const eventId = req.params.eventId;
        const eventController = await EventController.getInstance();
        await eventController.removeParticipant(eventId, userId);
        logger.info(`User ${(req.user as User).username} removed user with id ${userId} from event with id ${eventId}`);
        res.status(204).end();
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

eventRouter.delete('/:eventId/participant', ensureLoggedIn, isMember, async (req, res) => {
    try {
        const userId = (req.user as User).id;
        const eventId = req.params.eventId;
        const eventController = await EventController.getInstance();
        await eventController.removeParticipant(eventId, userId);
        logger.info(`User ${(req.user as User).username} left event with id ${eventId}`);
        res.status(204).end();
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
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
        logger.info(`User ${(req.user as User).username} modified event with id ${eventId}`);
        res.json(event);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
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
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(404).json(error);
    }
});

eventRouter.get('/:eventId/organisation', async (req, res) => {
    try {
        const eventController = await EventController.getInstance();
        const organisation = await eventController.getOrganisation(req.params.eventId);
        res.json(organisation);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(404).json(error);
    }
});

export {
    eventRouter
}
