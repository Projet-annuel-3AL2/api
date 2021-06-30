import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {User, UserType} from "../models/user.model";
import {EventController} from "../controllers/event.controller";
import {hasAdminRights} from "../middlewares/user.middleware";

const eventRouter = express.Router();

eventRouter.post('/', ensureLoggedIn, async (req, res) => {
    try {
        if (req.user instanceof User) {
            const user: User = req.user;
            if (user.certification != null || user.organisations != null) {

                const eventController = await EventController.getInstance();
                if (await eventController.isNameNotUse(req.body.name)) {
                    const event = eventController.create(req.user as User, req.body);
                    res.json(event);
                } else {
                    res.status(200).json("Error: Name already used")
                }
            } else {
                res.status(400).json("Error: User are not certified or belongs to an organisation")
            }
        } else {
            res.status(400).json("Error: Error with req.user")
        }
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

eventRouter.get('/suggestion', ensureLoggedIn, async (req, res) => {
    try {
        const eventController = await EventController.getInstance();
        const events = await eventController.getSuggestion();
        res.json(events);
    } catch (err) {
        res.status(400).json(err);
    }
});

eventRouter.get('/:eventId/profil', ensureLoggedIn, async (req, res) => {
    try {
        const eventController = await EventController.getInstance();
        const events = await eventController.getProfil(req.params.eventId);
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

eventRouter.get('/getEventWithUserLocation/:userLocationX/:userLocationY/:range', ensureLoggedIn, async (req, res) => {
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

eventRouter.get('/getEventWithUserLocationNotEnd/:userLocationX/:userLocationY/:range', ensureLoggedIn, async (req, res) => {
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

eventRouter.get('/userRechercheNameEvent/:userRecherche', ensureLoggedIn, async (req, res) => {
    try {
        const eventController = await EventController.getInstance();
        const events = await eventController.getWithNameRecherche(req.params.userRecherche)
        res.json(events)
    } catch (err) {
        res.status(400).json(err);
    }
})

eventRouter.delete('/:eventId', ensureLoggedIn, async (req, res) => {
    try {
        if (req.user instanceof User) {
            const eventId = req.params.eventId;
            const user: User = req.user;
            const eventController = await EventController.getInstance();
            const event = await eventController.getById(eventId);
            if (event != null) {
                if (event.user.id == user.id || user.userType == UserType.ADMIN || user.userType == UserType.SUPER_ADMIN) {
                    const event = eventController.delete(eventId);
                    res.json(event);
                } else {
                    res.status(300).json("Error: user are not the creator or admin")
                }
            } else {
                res.status(300).json("Error: There is no event with the given Id");
            }


        }


    } catch (err) {
        res.status(400).json(err);
    }
});

eventRouter.delete('/participant/:eventId/:userId', ensureLoggedIn, async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const userId = req.params.userId;

        const eventController = await EventController.getInstance();
        const event = await eventController.getById(eventId);

        if (event != null) {
            const eventController = await EventController.getInstance();
            const event = eventController.removeParticipant(eventId, userId);
            res.status(200).json(event);
        } else {
            res.status(400).json("Error: There is no event with the given Id");
        }
    } catch (err) {
        res.status(400).json(err);
    }
});

eventRouter.put('/:eventId', ensureLoggedIn, async (req, res) => {
    try {
        if (req.user instanceof User) {

            const eventId = req.body.eventId;
            const user: User = req.user;
            const userId = req.body.userId;

            const eventController = EventController.getInstance();

            const event = await eventController.getById(eventId);
            if (event != null) {

                if (event.user.id == user.id || user.userType == UserType.ADMIN || user.userType == UserType.SUPER_ADMIN) {
                    const event = eventController.update(eventId, {...req.body});
                    res.json(event);
                } else {
                    res.status(300).json("Error: user are not the creator of this event or admin")
                }
            } else {
                res.status(400).json("Error: There is no event with the given Id");
            }
        }

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

eventRouter.get('/:eventId/event-card', async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const eventController = await EventController.getInstance();
        const event = await eventController.getEventCard(eventId);
        res.json(event);
    } catch (err) {
        res.status(400).json(err);
    }
});

eventRouter.put("/:eventId/report", ensureLoggedIn, async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const userReporter = (req.user as User);
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

export {
    eventRouter
}
