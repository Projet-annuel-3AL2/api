import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {User, UserType} from "../models/user.model";
import {EventController} from "../controllers/event.controller";

const eventRouter = express.Router();

eventRouter.post('/', ensureLoggedIn, async (req, res) => {
    try {
        if (req.user instanceof User) {
            const user: User = req.user;
            if (user.certification != null || user.organisations != null){

                const eventController = await EventController.getInstance();
                if (await eventController.isNameNotUse(req.body.name)){
                    const event = eventController.create(req.user as User, req.body);
                    res.json(event);
                }else{
                    res.status(200).json("Error: Name already used")
                }
            }else{
                res.status(400).json("Error: User are not certified or belongs to an organisation")
            }
        }else{
            res.status(400).json("Error: Error with req.user")
        }
    } catch (err) {
        res.status(400).json(err);
    }
});


eventRouter.post('/addParticipant', ensureLoggedIn, async (req, res) => {
    try {
        if (req.user instanceof User) {
            const eventId = req.body.eventId;
            const user: User = req.user;
            const userId = req.body.userId;
            const username = req.body.username;
            const eventController = await EventController.getInstance();
            const event = await eventController.getById(eventId);

            if (event != null) {
                if (event.user.id == user.id || user.userType == UserType.ADMIN || user.userType == UserType.SUPER_ADMIN) {
                    const event2 = eventController.addParticipant(eventId, username, userId);
                    res.json(event2);
                } else {
                    res.status(400).json("Error: user are not the creator of this event or admin")
                }
            } else {
                res.status(400).json("Error: There is no event with the given Id");
            }
        }else{
            res.status(400).json("Error: Error with sessionId");
        }
    } catch (err) {
        res.status(400).json(err);
    }
});

eventRouter.get('/', ensureLoggedIn, async (req, res) => {
    try {
        const eventController = await EventController.getInstance();
        const event = eventController.getAll();
        res.json(event);
    } catch (err) {
        res.status(400).json(err);
    }
});

eventRouter.get('/notEndEvent', ensureLoggedIn, async (req, res) => {
    try {
        const eventController = await EventController.getInstance();
        const events = await eventController.getAllNotEnd();
        res.status(200).json(events);
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

eventRouter.get('/getEventWithUserLocation/:userLocationX/:userLocationY/:range', ensureLoggedIn, async (req, res) => {
    try {
        const userLocationX = req.params.userLocationX;
        const userLocationY = req.params.userLocationY;
        const range = req.params.range;
        const eventController = await EventController.getInstance();
        let events = await eventController.getEventWithLocation(Number(userLocationX),Number(userLocationY),Number(range));
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
        let events = await eventController.getEventWithLocationNotEnd(Number(userLocationX),Number(userLocationY),Number(range));
        res.json(events);
    } catch (err) {
        res.status(400).json(err);
    }
});

eventRouter.get('/userRechercheNameEvent/:userRecherche', ensureLoggedIn, async (req, res) => {
    try {
        const eventController = await EventController.getInstance();
        const events = await eventController.getWithNameRecherche(req.params.userRecherche)
        res.json(events)
    }catch (err) {
        res.status(400).json(err);
    }
})

eventRouter.delete('/:eventId', ensureLoggedIn, async (req, res) => {
    try {
        if (req.user instanceof User){
            const eventId = req.params.eventId;
            const user: User = req.user;
            const eventController = await EventController.getInstance();
            const event = await eventController.getById(eventId);
            if (event != null){
                if (event.user.id == user.id || user.userType == UserType.ADMIN || user.userType == UserType.SUPER_ADMIN){
                    const event = eventController.delete(eventId);
                    res.json(event);
                }else{
                    res.status(300).json("Error: user are not the creator or admin")
                }
            }else{
                res.status(300).json("Error: There is no event with the given Id");
            }


        }


    } catch (err) {
        res.status(400).json(err);
    }
});

eventRouter.delete('/participant/:eventId/:userId', ensureLoggedIn, async (req, res) => {
    try {
        if (req.user instanceof User){
            const eventId = req.params.eventId;
            const user: User = req.user;
            const userId = req.params.userId;

            const eventController = await EventController.getInstance();
            const event = await eventController.getById(eventId);

            if (event != null){
                if (event.user.id == user.id || user.userType == UserType.ADMIN || user.userType == UserType.SUPER_ADMIN){
                    const eventController = await EventController.getInstance();
                    const event = eventController.removeParticipant(eventId, userId);
                    res.json(event);
                }else{
                    res.status(300).json("Error: user are not the creator of this event or admin")
                }
            }else{
                res.status(400).json("Error: There is no event with the given Id");
            }

        }
    } catch (err) {
        res.status(400).json(err);
    }
});

eventRouter.put('/:eventId', ensureLoggedIn, async (req, res) => {
    try {
        if (req.user instanceof User){

            const eventId = req.body.eventId;
            const user: User = req.user;
            const userId = req.body.userId;

            const eventController = await EventController.getInstance();

            const event = await eventController.getById(eventId);
            if (event != null){

                if (event.user.id == user.id || user.userType == UserType.ADMIN || user.userType == UserType.SUPER_ADMIN){
                    const event = eventController.update(eventId, {...req.body});
                    res.json(event);
                }else{
                    res.status(300).json("Error: user are not the creator of this event or admin")
                }
            }else{
                res.status(400).json("Error: There is no event with the given Id");
            }
        }

    } catch (err) {
        res.status(400).json(err);
    }
});


export {
    eventRouter
}
