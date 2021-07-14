import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {hasAdminRights} from "../middlewares/user.middleware";
import {CertificationController} from "../controllers/certification.controller";
import {User} from "../models/user.model";
import {logger} from "../config/logging.config";

const certificationRouter = express.Router();

// TODO : hasAdminRights ne fonctionne pas
certificationRouter.get("/:certificateId", ensureLoggedIn, hasAdminRights, async (req, res) => {
    try {
        const certificateId = req.params.certificateId;
        const certificationController = CertificationController.getInstance();
        const certificationRequest = await certificationController.getById(certificateId);
        res.json(certificationRequest);
    } catch (err) {
        logger.error(err);
        res.status(404).json(err);
    }
});

certificationRouter.get("/", ensureLoggedIn, async (req, res) => {
    try {
        const certificationController = CertificationController.getInstance();
        const certificationRequests = await certificationController.getAll();
        res.json(certificationRequests);
    } catch (err) {
        logger.error(err);
        res.status(404).json(err);
    }
});

certificationRouter.get("/request/:requestId", ensureLoggedIn, hasAdminRights, async (req, res) => {
    try {
        const requestId = req.params.requestId;
        const certificationController = CertificationController.getInstance();
        const certificationRequest = await certificationController.getRequestById(requestId);
        res.json(certificationRequest);
    } catch (err) {
        logger.error(err);
        res.status(404).json(err);
    }
});

certificationRouter.get("/requests", ensureLoggedIn, async (req, res) => {
    try {
        const certificationController = CertificationController.getInstance();
        const certificationRequests = await certificationController.getAllRequests();
        res.json(certificationRequests);
    } catch (err) {
        logger.error(err);
        res.status(404).json(err);
    }
});

certificationRouter.put("/request/:requestId/approve", ensureLoggedIn, async (req, res) => {
    try {
        const requestId = req.params.requestId;
        const certificationController = CertificationController.getInstance();
        const certification = await certificationController.approveRequest(requestId, req.user as User);
        res.json(certification);
    } catch (err) {
        logger.error(err);
        res.status(400).json(err);
    }
});

certificationRouter.delete("/request/:requestId", ensureLoggedIn, async (req, res) => {
    try {
        const requestId = req.params.requestId;
        const certificationController = CertificationController.getInstance();
        await certificationController.rejectRequest(requestId);
        res.status(204).end();
    } catch (err) {
        logger.error(err);
        res.status(400).json(err);
    }
});

certificationRouter.post("/request", ensureLoggedIn, async (req, res) => {
    try {
        const certificationController = CertificationController.getInstance();
        const certificationRequest = await certificationController.requestCertification(req.user as User, {...req.body});
        res.json(certificationRequest);
    } catch (err) {
        logger.error(err);
        res.status(400).json(err);
    }
});

certificationRouter.delete("/:certificationId", ensureLoggedIn, async (req, res) => {
    try {
        const certificationId = req.params.certificationId;
        const certificationController = CertificationController.getInstance();
        await certificationController.revokeCertificate(certificationId);
        res.status(204).end();
    } catch (err) {
        logger.error(err);
        res.status(400).json(err);
    }
});

export {
    certificationRouter
}
