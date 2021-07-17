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
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(404).json(error);
    }
});

certificationRouter.get("/", ensureLoggedIn, async (req, res) => {
    try {
        const certificationController = CertificationController.getInstance();
        const certificationRequests = await certificationController.getAll();
        res.json(certificationRequests);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(404).json(error);
    }
});

certificationRouter.get("/request/:requestId", ensureLoggedIn, hasAdminRights, async (req, res) => {
    try {
        const requestId = req.params.requestId;
        const certificationController = CertificationController.getInstance();
        const certificationRequest = await certificationController.getRequestById(requestId);
        res.json(certificationRequest);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(404).json(error);
    }
});

certificationRouter.get("/requests", ensureLoggedIn, async (req, res) => {
    try {
        const certificationController = CertificationController.getInstance();
        const certificationRequests = await certificationController.getAllRequests();
        res.json(certificationRequests);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(404).json(error);
    }
});

certificationRouter.put("/request/:requestId/approve", ensureLoggedIn, async (req, res) => {
    try {
        const requestId = req.params.requestId;
        const certificationController = CertificationController.getInstance();
        const certification = await certificationController.approveRequest(requestId, req.user as User);
        logger.info(`User ${(req.user as User).username} approved certification request with id ${requestId}`);
        res.json(certification);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

certificationRouter.delete("/request/:requestId", ensureLoggedIn, async (req, res) => {
    try {
        const requestId = req.params.requestId;
        const certificationController = CertificationController.getInstance();
        await certificationController.rejectRequest(requestId);
        logger.info(`User ${(req.user as User).username} rejected certification request with id ${requestId}`);
        res.status(204).end();
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

certificationRouter.post("/request", ensureLoggedIn, async (req, res) => {
    try {
        const certificationController = CertificationController.getInstance();
        const certificationRequest = await certificationController.requestCertification(req.user as User, {...req.body});
        logger.info(`User ${(req.user as User).username} requested a certification`);
        res.json(certificationRequest);
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

certificationRouter.delete("/:certificationId", ensureLoggedIn, async (req, res) => {
    try {
        const certificationId = req.params.certificationId;
        const certificationController = CertificationController.getInstance();
        await certificationController.revokeCertificate(certificationId);
        logger.info(`User ${(req.user as User).username} revoked certification request with id ${certificationId}`);
        res.status(204).end();
    } catch (error) {
        logger.error(`${req.route.path} \n ${error}`);
        res.status(400).json(error);
    }
});

export {
    certificationRouter
}
