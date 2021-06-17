import {User} from "../models/user.model";

export async function isAskedUser(req, res, next) {
    if (req.user && (req.user as User).id === req.params.userId) {
        next();
    }
    res.status(404).end();
}
