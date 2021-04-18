import {Router} from "express";
import {userRouter} from "./user.route";

export function buildOrgAppRoutes() {
    const router = Router();
    router.use("/user", userRouter);
    return router;
}
