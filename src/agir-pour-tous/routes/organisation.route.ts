import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {hasAdminRights, isNotAskedUser} from "../middlewares/user.middleware";
import {User} from "../models/user.model";
import {OrganisationController} from "../controllers/organisation.controller";
import {
    isNotOrganisationUserOwner,
    isOrganisationAdmin,
    isOrganisationOwner
} from "../middlewares/organisation.middleware";
import {UserController} from "../controllers/user.controller";

const organisationRouter = express.Router();

organisationRouter.post('/', async (req, res) => {
    try {
        const organisationController = await OrganisationController.getInstance();
        const group = await organisationController.create(req.user as User, req.body);
        res.json(group);
    } catch (err) {
        res.status(400).json(err);
    }
});


organisationRouter.get('/', async (req, res) => {
    try {
        const organisationController = await OrganisationController.getInstance();
        const organisations = await organisationController.getAll();
        res.json(organisations);
    } catch (err) {
        res.status(400).json(err);
    }
});

organisationRouter.get('/:organisationId', async (req, res) => {
    try {
        const organisationId = req.params.organisationId;
        const organisationController = await OrganisationController.getInstance();
        const organisation = await organisationController.getById(organisationId);
        res.json(organisation);
    } catch (err) {
        res.status(404).json(err);
    }
});

organisationRouter.get('/:organisationId/posts', async (req, res) => {
    try {
        const organisationId = req.params.organisationId;
        const organisationController = await OrganisationController.getInstance();
        const posts = await organisationController.getPosts(organisationId);
        res.json(posts);
    } catch (err) {
        res.status(404).json(err);
    }
});

organisationRouter.put('/:organisationId/post',/* isMember,*/ async (req, res) => {
    try {
        const organisationId = req.params.organisationId;
        const organisationController = await OrganisationController.getInstance();
        const organisation = await organisationController.getById(organisationId);
        const posts = await organisationController.addPost(organisation, req.user as User, {...req.body});
        res.json(posts);
    } catch (err) {
        res.status(404).json(err);
    }
});

organisationRouter.delete('/:organisationId', ensureLoggedIn, isOrganisationOwner, async (req, res) => {
    try {
        const organisationId = req.params.organisationId;
        const organisationController = await OrganisationController.getInstance();
        await organisationController.delete(organisationId);
        res.status(204).end();
    } catch (err) {
        res.status(400).json(err);
    }
});

organisationRouter.put('/:organisationId', ensureLoggedIn, isOrganisationAdmin, async (req, res) => {
    try {
        const organisationId = req.params.organisationId;
        const organisationController = await OrganisationController.getInstance();
        await organisationController.update(organisationId, {...req.body});
        res.status(204).end();
    } catch (err) {
        res.status(400).json(err);
    }
});

organisationRouter.get('/:organisationId/followers', async (req, res) => {
    try {
        const organisationId = req.params.organisationId;
        const organisationController = await OrganisationController.getInstance();
        const followers = await organisationController.getFollowers(organisationId);
        res.json(followers);
    } catch (err) {
        res.status(404).json(err);
    }
});

organisationRouter.put('/:organisationId/follow', ensureLoggedIn, async (req, res) => {
    try {
        const organisationId = req.params.organisationId;
        const organisationController = await OrganisationController.getInstance();
        await organisationController.addFollower(organisationId, (req.user as User).id);
        res.status(204).end();
    } catch (err) {
        res.status(404).json(err);
    }
});

organisationRouter.delete('/:organisationId/unfollow', ensureLoggedIn, async (req, res) => {
    try {
        const organisationId = req.params.organisationId;
        const organisationController = await OrganisationController.getInstance();
        await organisationController.removeFollower(organisationId, (req.user as User).id);
        res.status(204).end();
    } catch (err) {
        res.status(404).json(err);
    }
});

organisationRouter.put("/:organisationId/report", ensureLoggedIn, async (req, res) => {
    try {
        const organisationId = req.params.organisationId;
        const userReporter = (req.user as User);
        const organisationController = OrganisationController.getInstance();
        const reportedOrganisation = await organisationController.getById(organisationId);
        const report = await organisationController.reportOrganisation(userReporter, reportedOrganisation, {...req.body});
        res.json(report);
    } catch (err) {
        res.status(400).json(err);
    }
});

organisationRouter.get("/:organisationId/reports", ensureLoggedIn, hasAdminRights, async (req, res) => {
    try {
        const organisationId = req.params.organisationId;
        const organisationController = OrganisationController.getInstance();
        const reports = await organisationController.getReports(organisationId);
        res.json(reports);
    } catch (err) {
        res.status(404).json(err);
    }
});

organisationRouter.get("/:organisationId/members", ensureLoggedIn, async (req, res) => {
    try {
        const organisationId = req.params.organisationId;
        const organisationController = OrganisationController.getInstance();
        const members = await organisationController.getMembers(organisationId);
        res.json(members);
    } catch (err) {
        res.status(404).json(err);
    }
});

organisationRouter.delete("/:organisationId/member/:userId", ensureLoggedIn, isOrganisationAdmin, async (req, res) => {
    try {
        const organisationId = req.params.organisationId;
        const userId = req.params.userId;
        const organisationController = OrganisationController.getInstance();
        await organisationController.removeMember(organisationId, userId);
        res.status(204).end();
    } catch (err) {
        res.status(400).json(err);
    }
});

organisationRouter.delete("/:organisationId/leave", ensureLoggedIn, async (req, res) => {
    try {
        const organisationId = req.params.organisationId;
        const userId = (req.user as User).id;
        const organisationController = OrganisationController.getInstance();
        await organisationController.removeMember(organisationId, userId);
        res.status(204).end();
    } catch (err) {
        res.status(400).json(err);
    }
});


organisationRouter.get('/:organisationId/is-admin', ensureLoggedIn, async (req, res) => {
    try {
        const organisationId = req.params.organisationId;
        const userId = (req.user as User).id;
        const organisationController = await OrganisationController.getInstance();
        const isAdmin = await organisationController.isAdmin(organisationId, userId);
        res.json(isAdmin);
    } catch (err) {
        res.status(404).json(err);
    }
});

organisationRouter.get('/:organisationId/is-owner', ensureLoggedIn, async (req, res) => {
    try {
        const organisationId = req.params.organisationId;
        const userId = (req.user as User).id;
        const organisationController = await OrganisationController.getInstance();
        const isOwner = await organisationController.isOwner(organisationId, userId);
        res.json(isOwner);
    } catch (err) {
        res.status(404).json(err);
    }
});

organisationRouter.get('/:organisationId/is-user-owner/:username', ensureLoggedIn, async (req, res) => {
    try {
        const organisationId = req.params.organisationId;
        const username = req.params.username;

        const userController = UserController.getInstance();
        const user = await userController.getByUsername(username);

        const organisationController = await OrganisationController.getInstance();
        const isOwner = await organisationController.isOwner(organisationId, user.id);
        res.json(isOwner);
    } catch (err) {
        res.status(404).json(err);
    }
});

organisationRouter.put('/:organisationId/add-admin/:userId', ensureLoggedIn, isNotAskedUser, isOrganisationOwner, isNotOrganisationUserOwner, async (req, res) => {
    try {
        const organisationId = req.params.organisationId;
        const userId = req.params.userId;
        const organisationController = await OrganisationController.getInstance();
        await organisationController.addAdmin(organisationId, userId);
        res.status(204).end();
    } catch (err) {
        res.status(400).json(err);
    }
});
organisationRouter.put('/:organisationId/remove-admin/:userId', ensureLoggedIn, isNotAskedUser, isOrganisationOwner, isNotOrganisationUserOwner, async (req, res) => {
    try {
        const organisationId = req.params.organisationId;
        const userId = req.params.userId;
        const organisationController = await OrganisationController.getInstance();
        await organisationController.removeAdmin(organisationId, userId);
        res.status(204).end();
    } catch (err) {
        res.status(400).json(err);
    }
});

organisationRouter.post('/:organisationId/invite/:userId', ensureLoggedIn, async (req, res) => {
    try {
        const organisationId = req.params.organisationId;
        const userId = req.params.userId;
        const organisationController = await OrganisationController.getInstance();
        await organisationController.inviteUser(organisationId, userId);
        res.status(204).end();
    } catch (err) {
        res.status(400).json(err);
    }
});

organisationRouter.delete('/:organisationId/cancel/:userId', ensureLoggedIn, async (req, res) => {
    try {
        const organisationId = req.params.organisationId;
        const userId = req.params.userId;
        const organisationController = await OrganisationController.getInstance();
        await organisationController.cancelInvitation(organisationId, userId);
        res.status(204).end();
    } catch (err) {
        res.status(400).json(err);
    }
});

organisationRouter.put('/:organisationId/invite/accept', ensureLoggedIn, async (req, res) => {
    try {
        const organisationId = req.params.organisationId;
        const user = (req.user as User);
        const organisationController = await OrganisationController.getInstance();
        const organisation = await organisationController.getById(organisationId);
        await organisationController.acceptInvitation(organisation, user);
        res.status(204).end();
    } catch (err) {
        res.status(400).json(err);
    }
});

organisationRouter.delete('/:organisationId/invite/reject', ensureLoggedIn, async (req, res) => {
    try {
        const organisationId = req.params.organisationId;
        const userId = (req.user as User).id;
        const organisationController = await OrganisationController.getInstance();
        await organisationController.rejectInvitation(organisationId, userId);
        res.status(204).end();
    } catch (err) {
        res.status(400).json(err);
    }
});

organisationRouter.get('/:organisationId/is-user-admin/:username', ensureLoggedIn, async (req, res) => {
    try {
        const organisationId = req.params.organisationId;
        const username = req.params.username;
        const organisationController = await OrganisationController.getInstance();
        const isAdmin = await organisationController.isAdmin(organisationId, username);
        res.json(isAdmin);
    } catch (err) {
        res.status(400).json(err);
    }
});

/*
organisationRouter.get("/suggestion/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const organisationController = await OrganisationController.getInstance();
        const organisations = await organisationController.getSuggestionOrganisation();
        res.json(organisations);
    } catch (err) {
        res.status(400).json(err);
    }
});
*/

export {
    organisationRouter
}
