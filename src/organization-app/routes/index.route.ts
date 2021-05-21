import {Router} from "express";
import {userRouter} from "./user.route";
import {authRouter} from "./auth.route";
import passport from "passport";
import {projectRouter} from "./project.route";
import {ticketRouter} from "./ticket.route";
import {commentRouter} from "./comment.route";
import {TypeormStore} from "connect-typeorm";
import {Session} from "../models/session.model";
import {getRepository} from "typeorm";
import {configure} from "../config/passport.config";
import {ensureLoggedIn} from "../middlewares/auth.middleware";

export function buildOrgAppRoutes() {
    const router = Router();
    configure();
    router.use(require('express-session')({
        secret: process.env.ORG_APP_SECRET,
        resave: true,
        saveUninitialized: true,
        store: new TypeormStore({
            cleanupLimit: 2,
            limitSubquery: false,
            ttl: 259200
        }).connect(getRepository(Session)),
    }));
    router.use(passport.initialize());
    router.use(passport.session());
    router.use("/user", ensureLoggedIn, userRouter);
    router.use("/project", ensureLoggedIn, projectRouter);
    router.use("/ticket", ensureLoggedIn, ticketRouter);
    router.use("/comment", ensureLoggedIn, commentRouter);
    router.use("/auth", authRouter);
    return router;
}
