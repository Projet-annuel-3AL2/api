import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {UserController} from "../controllers/user.controller";
import {hasAdminRights, isNotAskedUser} from "../middlewares/user.middleware";
import {User, UserProps} from "../models/user.model";
import {logger} from "../config/logging.config";
import {upload} from "./index.route";
import {MediaController} from "../controllers/media.controller";

const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
    try {
        const userController = UserController.getInstance();
        const user = await userController.getAll();
        res.json(user);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

userRouter.get("/conversations", ensureLoggedIn, async (req, res) => {
    try {
        const userController = UserController.getInstance();
        const conversations = await userController.getConversations((req.user as User).username);
        res.json(conversations);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

userRouter.get('/:username', async (req, res) => {
    try {
        const username = req.params.username;
        const userController = await UserController.getInstance();
        const user = await userController.getByUsername(username);
        res.json(user);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

userRouter.get('/:username/posts', async (req, res) => {
    try {
        const username = req.params.username;
        const userController = await UserController.getInstance();
        const posts = await userController.getPosts(username);
        res.json(posts);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(404).json(error);
    }
});

userRouter.delete('/', ensureLoggedIn, async (req, res) => {
    try {
        const username = (req.user as User).username;
        const userController = UserController.getInstance();
        await userController.delete(username);
        res.status(204).end();
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

userRouter.put('/', ensureLoggedIn, upload.fields([{ name: "profilePicture", maxCount: 1 },{name:"bannerPicture", maxCount:1}]), async (req, res) => {
    try {
        const username = (req.user as User).username;
        const userController = UserController.getInstance();
        const mediaController = MediaController.getInstance();
        let user: UserProps={...req.body};
        if(req.files) {
            if (req.files["profilePicture"]) {
                user.profilePicture = await mediaController.create(req.files["profilePicture"][0]);
            }
            if (req.files["bannerPicture"]) {
                user.bannerPicture = await mediaController.create(req.files["bannerPicture"][0]);
            }
        }
        await userController.update(username, user);
        res.status(204).end();
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

userRouter.get("/:username/groups", async (req, res) => {
    try {
        const username = req.params.username;
        const userController = UserController.getInstance();
        const groups = await userController.getGroups(username);
        res.json(groups);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

userRouter.get("/:username/participation", async (req, res) => {
    try {
        const username = req.params.username;
        const userController = UserController.getInstance();
        const eventParticipation = await userController.getEventsParticipation(username);
        res.json(eventParticipation);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

userRouter.get("/:username/organisations", async (req, res) => {
    try {
        const username = req.params.username;
        const userController = UserController.getInstance();
        const organisations = await userController.getOrganisations(username);
        res.json(organisations);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

userRouter.put("/:userId/block", ensureLoggedIn, isNotAskedUser, async (req, res) => {
    try {
        const userId = req.params.userId;
        const currentUserId = (req.user as User).id;
        const userController = UserController.getInstance();
        await userController.blockUser(currentUserId, userId);
        res.status(204).end();
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

userRouter.delete("/:userId/unblock", ensureLoggedIn, isNotAskedUser, async (req, res) => {
    try {
        const userId = req.params.userId;
        const currentUserId = (req.user as User).id;
        const userController = UserController.getInstance();
        await userController.unblockUser(currentUserId, userId);
        res.status(204).end();
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

/**
 *  Is the given user blocked by the connected user
 */
userRouter.get("/:userId/is-blocked", ensureLoggedIn, isNotAskedUser, async (req, res) => {
    try {
        const userId = req.params.userId;
        const currentUserId = (req.user as User).id;
        const userController = UserController.getInstance();
        const isBlocked = await userController.isBlocked(currentUserId, userId);
        res.json(isBlocked);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

/**
 *  Is the current user blocked by the given user
 */
userRouter.get("/:userId/blocked", ensureLoggedIn, isNotAskedUser, async (req, res) => {
    try {
        const userId = req.params.userId;
        const currentUserId = (req.user as User).id;
        const userController = UserController.getInstance();
        const isBlocked = await userController.isBlocked(userId, currentUserId);
        res.json(isBlocked);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

userRouter.put("/:username/report", ensureLoggedIn, isNotAskedUser, async (req, res) => {
    try {
        const username = req.params.username;
        const userReporter = (req.user as User);
        const userController = UserController.getInstance();
        const reportedUser = await userController.getByUsername(username);
        const report = await userController.reportUser(userReporter, reportedUser, {...req.body});
        res.json(report);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

userRouter.get("/:username/reports", ensureLoggedIn, hasAdminRights, async (req, res) => {
    try {
        const username = req.params.username;
        const userController = UserController.getInstance();
        const reports = await userController.getReports(username);
        res.json(reports);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

userRouter.get("/is-following-orga/:organisationId", ensureLoggedIn, async (req, res) => {
    try {
        const organisationId = req.params.organisationId;
        const userController = UserController.getInstance();
        const isFollowing = await userController.isFollowingOrganisation((req.user as User).id, organisationId);
        res.json(isFollowing);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

userRouter.get("/:username/friends", ensureLoggedIn, async (req, res) => {
    try {
        const username = req.params.username;
        const userController = UserController.getInstance();
        const friends = await userController.getFriends(username);
        res.json(friends);
    } catch (error) {
        logger.error({route: req.route, error});
        res.status(400).json(error);
    }
});

export {
    userRouter
}

