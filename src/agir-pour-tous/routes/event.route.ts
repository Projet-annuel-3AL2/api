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

const eventRouter = express.Router();

eventRouter.post('/', ensureLoggedIn, canCreateEvent, async (req, res) => {
    try {
        const eventController = await EventController.getInstance();
        const event = await eventController.create(req.user as User, req.body);
        logger.info(`User ${(req.user as User).username} created event called ${event.name} with the id ${event.id}`);
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

eventRouter.get('/getEventWithUserLocation/:userLocationX/:userLocationY/:range', async (req, res) => {
    try {
        const userLocationX = req.params.userLocationX;
        const userLocationY = req.params.userLocationY;
        const range = req.params.range;
        const eventController = await EventController.getInstance();
        let events = await eventController.getEventWithLocation(Number(userLocationX), Number(userLocationY), Number(range));
        res.json(events);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
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
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
})

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

eventRouter.get('/:eventId/posts', async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const eventController = await EventController.getInstance();
        const posts = await eventController.getPosts(eventId);
        res.json(posts);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

eventRouter.put("/:eventId/report", ensureLoggedIn, async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const userReporter = req.user as User;
        const eventController = EventController.getInstance();
        const reportedEvent = await eventController.getById(eventId);
        const report = await eventController.reportEvent(userReporter, reportedEvent, {...req.body});
        logger.info(`User ${(req.user as User).username} reported event with id ${eventId}`);
        res.json(report);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

eventRouter.get("/:eventId/reports", ensureLoggedIn, hasAdminRights, async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const eventController = EventController.getInstance();
        const reports = await eventController.getReports(eventId);
        res.json(reports);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

eventRouter.get('/:eventId/owner', async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const eventController = EventController.getInstance();
        const owners = await eventController.getOwner(eventId);
        res.json(owners);
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
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(404).json(error);
    }
});

eventRouter.get('/:eventId/profil', async (req, res) => {
    try {
        const eventController = await EventController.getInstance();
        const events = await eventController.getProfil(req.params.eventId);
        res.json(events);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
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
