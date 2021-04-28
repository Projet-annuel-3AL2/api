import {Router} from "express";
import {userRouter} from "./user.route";
import {configure} from "../config/passport.config";
import {authRouter} from "./auth.route";
import passport from "passport";
import {ensureLoggedIn} from "../middlewares/auth.middleware";

export function buildOrgAppRoutes() {
    const router = Router();
    configure();
    router.use(passport.initialize());
    router.use(passport.session());
    router.use("/user", ensureLoggedIn, userRouter);
    router.use("/auth", authRouter);
    return router;
}
