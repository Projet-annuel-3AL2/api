import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {UserController} from "../controllers/user.controller";
import {hasAdminRights, isNotAskedUser, isNotBlocked, isSuperAdmin} from "../middlewares/user.middleware";
import {User, UserProps} from "../models/user.model";
import {logger} from "../config/logging.config";
import {upload} from "./index.route";
import {MediaController} from "../controllers/media.controller";
import {FriendshipController} from "../controllers/friendship.controller";
import {OrganisationController} from "../controllers/organisation.controller";
import {organisationRouter} from "./organisation.route";

const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
    try {
        const userController = UserController.getInstance();
        const user = await userController.getAll();
        res.json(user);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

userRouter.get("/conversations", ensureLoggedIn, async (req, res) => {
    try {
        const userController = UserController.getInstance();
        const conversations = await userController.getConversations((req.user as User).username);
        res.json(conversations);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

userRouter.get('/:username', isNotBlocked, async (req, res) => {
    try {
        const username = req.params.username;
        const userController = await UserController.getInstance();
        const user = await userController.getByUsername(username);
        res.json(user);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

userRouter.get('/:username/posts/:limit/:offset', async (req, res) => {
    try {
        const limit = parseInt(req.params.limit);
        const offset = parseInt(req.params.offset);
        const username = req.params.username;
        const userController = await UserController.getInstance();
        const posts = await userController.getPosts(username, limit, offset);
        res.json(posts);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(404).json(error);
    }
});

userRouter.delete('/', ensureLoggedIn, async (req, res) => {
    try {
        const username = (req.user as User).username;
        const userController = UserController.getInstance();
        await userController.delete(username);
        logger.info(`User ${(req.user as User).username} has deleted his account`);
        res.status(204).end();
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

userRouter.put('/', ensureLoggedIn, upload.fields([{name: "profilePicture", maxCount: 1}, {
    name: "bannerPicture",
    maxCount: 1
}]), async (req, res) => {
    try {
        const username = (req.user as User).username;
        const userController = UserController.getInstance();
        const mediaController = MediaController.getInstance();
        let user: UserProps = {...req.body};
        if (req.files) {
            if (req.files["profilePicture"]) {
                user.profilePicture = await mediaController.create(req.files["profilePicture"][0]);
            }
            if (req.files["bannerPicture"]) {
                user.bannerPicture = await mediaController.create(req.files["bannerPicture"][0]);
            }
        }
        await userController.update(username, user);
        logger.info(`User ${(req.user as User).username} has updated his account informations`);
        res.status(204).end();
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
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
        logger.error(`${req.route.path} \n ${error}`);
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
        logger.error(`${req.route.path} \n ${error}`);
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
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

userRouter.put("/:username/block", ensureLoggedIn, isNotAskedUser, async (req, res) => {
    try {
        const username = req.params.username;
        const currentUserId = (req.user as User).id;
        const userController = UserController.getInstance();
        await userController.blockUser(currentUserId, (await userController.getByUsername(username)).id);
        const friendshipController = FriendshipController.getInstance();
        friendshipController.removeFriendship(username, (req.user as User).username).then()
        logger.info(`User ${(req.user as User).username} has blocked an user called ${username}`);
        res.status(204).end();
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

userRouter.delete("/:username/unblock", ensureLoggedIn, isNotAskedUser, async (req, res) => {
    try {
        const username = req.params.username;
        const currentUserId = (req.user as User).id;
        const userController = UserController.getInstance();
        await userController.unblockUser(currentUserId, (await userController.getByUsername(username)).id);
        logger.info(`User ${(req.user as User).username} has unblocked an user called ${username}`);
        res.status(204).end();
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

/**
 *  Is the given user blocked by the connected user
 */
userRouter.get("/:username/has-blocked", ensureLoggedIn, async (req, res) => {
    try {
        const username = req.params.username;
        const currentUsername = (req.user as User).username;
        const userController = UserController.getInstance();
        const isBlocked = await userController.hasBlocked(currentUsername, username);
        res.json(isBlocked);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

/**
 *  Is the current user blocked by the given user
 */
userRouter.get("/:username/is-blocked", ensureLoggedIn, async (req, res) => {
    try {
        const username = req.params.username;
        const currentUsername = (req.user as User).username;
        const userController = UserController.getInstance();
        const isBlocked = await userController.isBlocked(username, currentUsername);
        res.json(isBlocked);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
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
        logger.info(`User ${(req.user as User).username} has reported an user called ${username}`);
        res.json(report);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
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
        logger.error(`${req.route.path} \n ${error}`);
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
        logger.error(`${req.route.path} \n ${error}`);
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
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

userRouter.get("/reports/all-users", ensureLoggedIn, isSuperAdmin, async (req, res) => {
    try {
        const userController = UserController.getInstance();
        const reports = await userController.getAllReport();
        res.json(reports);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

userRouter.get("/:userId/count-report", ensureLoggedIn, isSuperAdmin, async (req, res) => {
    try {
        const userId = req.params.userId;
        const userController = UserController.getInstance();
        const reports = await userController.countReport(userId);
        res.json(reports);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

userRouter.delete("/report/:reportId", ensureLoggedIn, isSuperAdmin, async (req, res) => {
    try {
        const reportId = req.params.reportId;
        const userController = UserController.getInstance();
        await userController.deleteReport(reportId);
        res.status(204).end();
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

userRouter.get("/organisation/invitations", ensureLoggedIn, async (req, res) => {
    try {
        const userController = UserController.getInstance();
        const user = await userController.getOrganisationInvitations((req.user as User).id);
        res.json(user);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

userRouter.delete("/:username", ensureLoggedIn, isSuperAdmin, async (req, res) => {
   try {
       const username = req.params.username
       const userController = UserController.getInstance();
       await userController.delete(username);
       logger.info(`User ${(req.user as User).username} has delete an user called ${username}`);
       res.status(204).end();
   } catch (error) {
       logger.error(`${req.route.path} \n ${error}`);
       res.status(400).json(error);
   }
});

userRouter.delete("/:userId/profile-picture", ensureLoggedIn, async (req, res) => {
    try {
        const userId = req.params.userId;
        const userController = UserController.getInstance();
        await userController.removeProfilePicture(userId);
        logger.info(`User ${(req.user as User).username} has deleted ProfilePicture of user id : "${userId}"`);
        res.status(204).end();
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

userRouter.delete("/:userId/banner-picture", ensureLoggedIn, async (req, res) => {
    try {
        const userId = req.params.userId;
        const userController = UserController.getInstance();
        await userController.removeBannerPicture(userId);
        logger.info(`User ${(req.user as User).username} has deleted BannerPicture of user id : "${userId}"`);
        res.status(204).end();
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});
export {
    userRouter
}

