import {OrganisationController} from "../controllers/organisation.controller";
import {User, UserType} from "../models/user.model";
import {logger} from "../config/logging.config";

export function isOrganisationAdmin(req, res, next) {
    try {
        const organisationId = req.params.organisationId;
        const organisationController = OrganisationController.getInstance();
        if (!req.user && (!organisationController.isAdmin(organisationId, (req.user as User).id) ||
            (req.user as User).userType === UserType.ADMIN || (req.user as User).userType === UserType.SUPER_ADMIN)) {
            return res.status(403).end();
        }
        next();
    } catch (e) {
        logger.error("middleware isOrganisationAdmin: " + e);
        res.status(400).end();
    }
}

export function isOrganisationOwner(req, res, next) {
    try {
        const organisationId = req.params.organisationId;
        const organisationController = OrganisationController.getInstance();
        if (!req.user && (!organisationController.isOwner(organisationId, (req.user as User).id) ||
            (req.user as User).userType === UserType.ADMIN || (req.user as User).userType === UserType.SUPER_ADMIN)) {
            return res.status(403).end();
        }
        next();
    } catch (e) {
        logger.error("middleware isOrganisationOwner: " + e);
        res.status(400).end();
    }
}

export function isNotOrganisationUserOwner(req, res, next) {
    try {
        const organisationId = req.params.organisationId;
        const userId = req.params.userId;
        const organisationController = OrganisationController.getInstance();
        if (!req.user && organisationController.isOwner(organisationId, userId)) {
            return res.status(403).end();
        }
        next();
    } catch (e) {
        logger.error("middleware isNotOrganisationUserOwner: " + e);
        res.status(400).end();
    }
}

export function isOrganisationUserNotAdmin(req, res, next) {
    try {
        const organisationId = req.params.organisationId;
        const userId = req.params.userId;
        const organisationController = OrganisationController.getInstance();
        if (!req.user && organisationController.isAdmin(organisationId, userId)) {
            return res.status(403).end();
        }
        next();
    } catch (e) {
        logger.error("middleware isOrganisationUserNotAdmin: " + e);
        res.status(400).end();
    }
}

export function isOrganisationUserMember(req, res, next) {
    try {
        const organisationId = req.params.organisationId;
        const userId = req.params.userId;
        const organisationController = OrganisationController.getInstance();
        if (!req.user && !(organisationController.getMember(organisationId, userId) !== undefined)) {
            return res.status(404).end();
        }
        next();
    } catch (e) {
        logger.error("middleware isOrganisationUserMember: " + e);
        res.status(400).end();
    }
}
