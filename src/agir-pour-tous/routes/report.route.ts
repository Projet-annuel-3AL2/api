import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {PostController} from "../controllers/post.controller";
import {User} from "../models/user.model";
import {ReportController} from "../controllers/report.controller";

const reportRouter = express.Router();

// get
reportRouter.get('/', ensureLoggedIn, async (req, res) => {
    try {
        const reportController = ReportController.getInstance();
        const reports = reportController.getAll();
        res.json(reports);
    } catch (err) {
        res.status(400).json(err);
    }
});

reportRouter.get('/:reportId', ensureLoggedIn, async (req, res) => {
    try {
        const reportController = ReportController.getInstance();
        const report = reportController.getById(req.params.reportId);
        res.json(report);
    } catch (err) {
        res.status(400).json(err);
    }
});

reportRouter.get('/allFromUserReporter/:userId', ensureLoggedIn, async (req, res) => {
    try {
        const reportController = ReportController.getInstance();
        const reports = reportController.getAllFromUserReporter(req.params.userId);
        res.json(reports);
    } catch (err) {
        res.status(400).json(err);
    }
});

reportRouter.get('/allReportedUser', ensureLoggedIn, async (req, res) => {
    try {
        const reportController = ReportController.getInstance();
        const reports = reportController.getAllReportedUser();
        res.json(reports);
    } catch (err) {
        res.status(400).json(err);
    }
});

reportRouter.get('/allFromReportedUser/:userId', ensureLoggedIn, async (req, res) => {
    try {
        const reportController = ReportController.getInstance();
        const reports = reportController.getAllReportFromReportedUser(req.params.userId);
        res.json(reports);
    } catch (err) {
        res.status(400).json(err);
    }
});

reportRouter.get('/allReportedOrga', ensureLoggedIn, async (req, res) => {
    try {
        const reportController = ReportController.getInstance();
        const reports = reportController.getAllReportedOrga();
        res.json(reports);
    } catch (err) {
        res.status(400).json(err);
    }
});

reportRouter.get('/allFromReportedOrga/:orgaId', ensureLoggedIn, async (req, res) => {
    try {
        const reportController = ReportController.getInstance();
        const reports = reportController.getAllReportFromReportedOrga(req.params.orgaId);
        res.json(reports);
    } catch (err) {
        res.status(400).json(err);
    }
});

reportRouter.get('/allReportedPost', ensureLoggedIn, async (req, res) => {
    try {
        const reportController = ReportController.getInstance();
        const reports = reportController.getAllReportedPost();
        res.json(reports);
    } catch (err) {
        res.status(400).json(err);
    }
});

reportRouter.get('/allFromReportedPost/:postId', ensureLoggedIn, async (req, res) => {
    try {
        const reportController = ReportController.getInstance();
        const reports = reportController.getAllReportFromReportedPost(req.params.postId);
        res.json(reports);
    } catch (err) {
        res.status(400).json(err);
    }
});

reportRouter.get('/allReportedEvent', ensureLoggedIn, async (req, res) => {
    try {
        const reportController = ReportController.getInstance();
        const reports = reportController.getAllReportedEvent();
        res.json(reports);
    } catch (err) {
        res.status(400).json(err);
    }
});

reportRouter.get('/allFromReportedEvent/:eventId', ensureLoggedIn, async (req, res) => {
    try {
        const reportController = ReportController.getInstance();
        const reports = reportController.getAllReportFromReportedEvent(req.params.eventId);
        res.json(reports);
    } catch (err) {
        res.status(400).json(err);
    }
});

reportRouter.get('/allReportedGroup', ensureLoggedIn, async (req, res) => {
    try {
        const reportController = ReportController.getInstance();
        const reports = reportController.getAllReportedGroup();
        res.json(reports);
    } catch (err) {
        res.status(400).json(err);
    }
});

reportRouter.get('/allFromReportedGroup/:groupId', ensureLoggedIn, async (req, res) => {
    try {
        const reportController = ReportController.getInstance();
        const reports = reportController.getAllReportFromReportedGroup(req.params.groupId);
        res.json(reports);
    } catch (err) {
        res.status(400).json(err);
    }
});

//delete
reportRouter.delete('/:reportId', ensureLoggedIn, async(req, res) => {
    try {
        const reportController = ReportController.getInstance();
        const report = reportController.delete(req.params.reportId);
        res.json(report);
    } catch (err) {
        res.status(400).json(err);
    }
})

//Post
// TODO : postReportUser
// TODO : postReportOrga
// TODO : postReportPost
// TODO : postReportEvent
// TODO : postReportGroup

export {
    reportRouter
}
