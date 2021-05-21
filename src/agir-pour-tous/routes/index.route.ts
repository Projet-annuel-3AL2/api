import {Router} from "express";
import passport from "passport";
import {TypeormStore} from "connect-typeorm";
import {getRepository} from "typeorm";
import {Session} from "../models/session.model";
import {configure} from "../config/passport.config";

export function buildAPTRoutes() {
    const router = Router();
    configure();
    router.use(passport.initialize());
    router.use(passport.session());
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

    return router;
}
