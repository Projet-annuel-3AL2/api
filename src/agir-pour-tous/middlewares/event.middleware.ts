import {User, UserType} from "../models/user.model";
import {EventController} from "../controllers/event.controller";
import {UserController} from "../controllers/user.controller";
import {OrganisationController} from "../controllers/organisation.controller";
import {logger} from "../config/logging.config";

export async function isEventOrganiser(req, res, next) {
    try {
        const eventId = req.params.eventId;
        const eventController = EventController.getInstance();
        if (!req.user && (!(await eventController.isOwner(eventId, (req.user as User).id)) ||
            (req.user as User).userType === UserType.ADMIN || (req.user as User).userType === UserType.SUPER_ADMIN)) {
            return res.status(403).end();
        }
        next();
    } catch (e) {
        logger.error("middleware isEventOrganiser: " + e);
        res.status(400).end();
    }
}

export async function isNotEventOrganiser(req, res, next) {
    try {
        const eventId = req.params.eventId;
        const eventController = EventController.getInstance();
        if (!req.user && await eventController.isOwner(eventId, (req.user as User).id)) {
            return res.status(403).end();
        }
        next();
    } catch (e) {
        logger.error("middleware isNotEventOrganiser: " + e);
        res.status(400).end();
    }
}

export async function canCreateEvent(req, res, next) {
    try {
        const userController = UserController.getInstance();
        const organisationController = OrganisationController.getInstance();
        const organisations = (await userController.getOrganisations((req.user as User).username));
        if (!req.user && ((req.user as User).certification !== undefined ||
            organisations.some(organisation => organisationController.isOwner(organisation.id, (req.user as User).id)
                || organisationController.isAdmin(organisation.id, (req.user as User).id)) || (req.user as User).userType === UserType.ADMIN || (req.user as User).userType === UserType.SUPER_ADMIN)) {
            return res.status(403).end();
        }
        next();
    } catch (e) {
        logger.error("middleware canCreateEvent: " + e);
        res.status(400).end();
    }
}

export async function isMember(req, res, next) {
    try {
        const eventId = req.params.eventId;
        const eventController = EventController.getInstance();
        if (!req.user && (await eventController.isMember(eventId, (req.user as User).id))) {
            return res.status(403).end();
        }
        next();
    } catch (e) {
        logger.error("middleware isMember: " + e);
        res.status(400).end();
    }
}

export async function isNotMember(req, res, next) {
    try {
        const eventId = req.params.eventId;
        const eventController = EventController.getInstance();
        if (!req.user && !(await eventController.isMember(eventId, (req.user as User).id))) {
            return res.status(403).end();
        }
        next();
    } catch (e) {
        logger.error("middleware isNotMember: " + e);
        res.status(400).end();
    }
}
