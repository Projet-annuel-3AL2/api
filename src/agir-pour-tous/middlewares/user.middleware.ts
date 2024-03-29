import {User, UserType} from "../models/user.model";
import {UserController} from "../controllers/user.controller";
import {logger} from "../config/logging.config";

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
    try {
        const username = req.params.username;
        if(req.user) {
            const userController = UserController.getInstance();
            const blocksCurrentUser = await userController.isBlocked(username, (req.user as User).username);
            if (blocksCurrentUser && (req.user as User).userType === UserType.USER) {
                return res.status(200).json({blocksCurrentUser});
            }
        }
        next();
    } catch (e) {
        logger.error("middleware isNotBlocked: " + e);
        res.status(400).json(e);
    }
}
