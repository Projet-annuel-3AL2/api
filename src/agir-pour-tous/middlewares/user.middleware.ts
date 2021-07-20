import {User, UserType} from "../models/user.model";
import {UserController} from "../controllers/user.controller";

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

export async function isNotBlocked(req, res, next) {
    const username = req.params.username;
    const userController = UserController.getInstance();
    const blocksCurrentUser = await userController.isBlocked(username, (req.user as User).username);
    if (blocksCurrentUser) {
        return res.status(200).json({blocksCurrentUser});
    }
    next();
}
