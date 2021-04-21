import {Router} from "express";
import {userRouter} from "./user.route";
import {configure} from "../config/passport.config";
import {authRouter} from "./auth.route";
import passport from "passport";

export function buildOrgAppRoutes() {
    const router = Router();
    router.use(passport.initialize());
    router.use(passport.session());
    configure();
    router.use("/user", userRouter);
    router.use("/auth", authRouter);
    return router;
}
