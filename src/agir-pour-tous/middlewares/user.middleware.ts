import {User, UserType} from "../models/user.model";

export async function isAskedUser(req, res, next) {
    if (!(req.user && (req.user as User).username === req.params.username)) {
        return res.status(404).end();
    }
    next();
}

export async function isNotAskedUser(req, res, next) {
    if (!(req.user && (req.user as User).username !== req.params.username)) {
        return res.status(403).end();
    }
    next();
}

export async function hasAdminRights(req, res, next) {
    if (!(req.user && ((req.user as User).userType === UserType.SUPER_ADMIN || (req.user as User).userType === UserType.ADMIN))) {
        return res.status(403).end();
    }
    next();
}

export async function isSuperAdmin(req, res, next) {
    if (!(req.user && (req.user as User).userType === UserType.SUPER_ADMIN)) {
        return res.status(403).end();
    }
    next();
}
