import {User} from "../models/user.model";
import {EventController} from "../controllers/event.controller";
import {UserController} from "../controllers/user.controller";
import {OrganisationController} from "../controllers/organisation.controller";

export async function isEventOrganiser(req, res, next) {
    const eventId = req.params.eventId;
    const eventController = EventController.getInstance();
    if (!req.user && !(await eventController.getOwners(eventId)).some(user => user.id === (req.user as User).id)) {
        return res.status(403).end();
    }
    next();
}

export async function canCreateEvent(req, res, next) {
    const userController = UserController.getInstance();
    const organisationController = OrganisationController.getInstance();
    const organisations = (await userController.getOrganisations((req.user as User).username));
    if (!req.user && ((req.user as User).certification !== undefined ||
        organisations.some(organisation => organisationController.isOwner(organisation.id, (req.user as User).id)
            || organisationController.isAdmin(organisation.id, (req.user as User).id)))) {
        return res.status(403).end();
    }
    next();
}
