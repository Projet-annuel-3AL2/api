export function ensureLoggedOut(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return res.status(401).end();
    }
    next();
}

export function ensureLoggedIn(req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.status(401).end();
    }
    next();
}

export function ensureAdminLoggedIn(req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated() || !req.user.isAdmin) {
        return res.status(401).end();
    }
    next();
}
