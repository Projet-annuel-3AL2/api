import {OrganisationController} from "../controllers/organisation.controller";
import {User, UserType} from "../models/user.model";

export function isOrganisationAdmin(req, res, next) {
    const organisationId = req.params.organisationId;
    const organisationController = OrganisationController.getInstance();
    if (!req.user && (!organisationController.isAdmin(organisationId, (req.user as User).id) ||
        (req.user as User).userType === UserType.ADMIN || (req.user as User).userType === UserType.SUPER_ADMIN)) {
        return res.status(403).end();
    }
    next();
}

export function isOrganisationOwner(req, res, next) {
    const organisationId = req.params.organisationId;
    const organisationController = OrganisationController.getInstance();
    if (!req.user && (!organisationController.isOwner(organisationId, (req.user as User).id) ||
        (req.user as User).userType === UserType.ADMIN || (req.user as User).userType === UserType.SUPER_ADMIN)) {
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

export function isOrganisationUserMember(req, res, next) {
    const organisationId = req.params.organisationId;
    const userId = req.params.userId;
    const organisationController = OrganisationController.getInstance();
    if (!req.user && !(organisationController.getMember(organisationId, userId) !== undefined)) {
        return res.status(404).end();
    }
    next();
}
