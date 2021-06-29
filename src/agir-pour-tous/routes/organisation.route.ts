import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {isAskedUser} from "../middlewares/user.middleware";
import {User} from "../models/user.model";
import {OrganisationController} from "../controllers/organisation.controller";

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

organisationRouter.put('/:organisationId/post', async (req, res) => {
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

organisationRouter.delete('/:organisationId', ensureLoggedIn, async (req, res) => {
    try {
        const organisationId = req.params.organisationId;
        const organisationController = await OrganisationController.getInstance();
        await organisationController.delete(organisationId);
        res.status(204).end();
    } catch (err) {
        res.status(400).json(err);
    }
});

organisationRouter.put('/:organisationId', ensureLoggedIn, isAskedUser, async (req, res) => {
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
