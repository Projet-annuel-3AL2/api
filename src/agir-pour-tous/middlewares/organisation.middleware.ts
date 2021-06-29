import {OrganisationController} from "../controllers/organisation.controller";
import {User} from "../models/user.model";

export function isOrganisationAdmin(req, res, next) {
    const organisationId = req.params.organisationId;
    const organisationController = OrganisationController.getInstance();
    if (!req.user && !organisationController.isAdmin(organisationId, (req.user as User).id)) {
        return res.status(403).end();
    }
    next();
}

export function isOrganisationOwner(req, res, next) {
    const organisationId = req.params.organisationId;
    const organisationController = OrganisationController.getInstance();
    if (!req.user && !organisationController.isOwner(organisationId, (req.user as User).id)) {
        return res.status(403).end();
    }
    next();
}

export function isNotOrganisationUserOwner(req, res, next) {
    const organisationId = req.params.organisationId;
    const userId = req.params.userId;
    const organisationController = OrganisationController.getInstance();
    if (!req.user && !organisationController.isOwner(organisationId, userId)) {
        return res.status(403).end();
    }
    next();
}

export function isOrganisationUserNotAdmin(req, res, next) {
    const organisationId = req.params.organisationId;
    const userId = req.params.userId;
    const organisationController = OrganisationController.getInstance();
    if (!req.user && !organisationController.isOwner(organisationId, userId)) {
        return res.status(403).end();
    }
    next();
}
