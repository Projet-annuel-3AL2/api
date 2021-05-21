export function ensureLoggedOut(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return res.status(401).end();
    }
    next();
}

export function ensureLoggedIn(req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        console.log(req.isAuthenticated())
        console.log("aaaaaa")
        console.log(req.isAuthenticated)
        console.log(req.user)
        return res.status(401).end();
    }
    next();
}