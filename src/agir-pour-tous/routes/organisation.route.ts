import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {isAskedUser} from "../middlewares/user.middleware";
import {User} from "../models/user.model";
import {OrganisationController} from "../controllers/organisation.controller";
import {groupRouter} from "./group.route";

const organisationRouter = express.Router();

organisationRouter.post('/', async (req, res) => {
    try {
        const organisationController = OrganisationController.getInstance();
        const group = await organisationController.create(req.user as User, req.body);
        res.json(group);
    } catch (err) {
        res.status(400).json(err);
    }
});


organisationRouter.get('/', async (req, res) => {
    try {
        const organisationController = OrganisationController.getInstance();
        const organisations = await organisationController.getAll();
        res.json(organisations);
    } catch (err) {
        res.status(400).json(err);
    }
});

organisationRouter.get('/:organisationName', async (req, res) => {
    try {
        const organisationName = req.params.organisationName;
        const organisationController = OrganisationController.getInstance();
        const group = await organisationController.getByName(organisationName);
        res.json(group);
    } catch (err) {
        res.status(404).json(err);
    }
});

organisationRouter.delete('/:organisationName', ensureLoggedIn, async (req, res) => {
    try {
        const organisationName = req.params.organisationName;
        const organisationController = OrganisationController.getInstance();
        await organisationController.delete(organisationName);
        res.status(204).end();
    } catch (err) {
        res.status(400).json(err);
    }
});

organisationRouter.put('/:organisationName', ensureLoggedIn, isAskedUser, async (req, res) => {
    try {
        const organisationName = req.params.organisationName;
        const organisationController = OrganisationController.getInstance();
        await organisationController.update(organisationName, {...req.body});
        res.status(204).end();
    } catch (err) {
        res.status(400).json(err);
    }
});

organisationRouter.get("/:organisationName/posts", async (req, res) => {
    try {
        const organisationName = req.params.organisationName;
        const organisationController = OrganisationController.getInstance();
        const posts = organisationController.getPosts(organisationName)
        res.json(posts);
    } catch (err) {
        res.status(400).json(err);
    }
});

groupRouter.post("/:groupName/posts", async (req, res) => {
    try {
        const organisationName = req.params.groupName;
        const organisationController = OrganisationController.getInstance();
        const organisation = await organisationController.getByName(organisationName);
        const post = await organisationController.addPost(organisation, req.user as User, req.body)
        res.json(post);
    } catch (err) {
        res.status(400).json(err);
    }
});


export {
    organisationRouter
}
