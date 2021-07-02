import {User} from "../models/user.model";
import {EventController} from "../controllers/event.controller";

export async function isEventOrganiser(req, res, next) {
    const eventId = req.params.eventId;
    const eventController = EventController.getInstance();
    if (!req.user && !(await eventController.getOwners(eventId)).some(user => user.id === (req.user as User).id)) {
        return res.status(403).end();
    }
    next();
}
