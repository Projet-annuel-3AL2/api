import {Router} from "express";
import passport from "passport";
import {TypeormStore} from "connect-typeorm";
import {getRepository} from "typeorm";
import {Session} from "../models/session.model";
import {configure} from "../config/passport.config";
import {authRouter} from "./auth.route";
import {userRouter} from "./user.route";
import {groupRouter} from "./group.route";
import {organisationRouter} from "./organisation.route";
import {postRouter} from "./post.route";
import {categoryRouter} from "./category.route";
import {friendshipRouter} from "./friendship.route";
import {conversationRouter} from "./conversation.route";
import {eventRouter} from "./event.route";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {isConversationMember} from "../middlewares/conversation.middleware";
import {searchRouter} from "./search.route";
import {logger} from "../config/logging.config";
import {certificationRouter} from "./certification.route";

export function buildAPTRoutes() {
    const router = Router();
    configure();
    logger.info("Init APT routes")
    router.use(require('cors')({credentials: true, origin: process.env.FRONT_BASE_URL}));
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
    router.use("/auth", authRouter);
    router.use("/user", userRouter);
    router.use("/category", categoryRouter);
    router.use("/group", groupRouter);
    router.use("/organisation", organisationRouter);
    router.use("/post", postRouter);
    router.use("/friendship", friendshipRouter);
    router.use("/conversation", ensureLoggedIn, isConversationMember, conversationRouter);
    router.use("/event", eventRouter);
    router.use("/search", searchRouter);
    router.use("/certification", certificationRouter);
    return router;
}
