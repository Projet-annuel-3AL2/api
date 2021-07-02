import express from "express";
import {ensureLoggedIn} from "../middlewares/auth.middleware";
import {hasAdminRights} from "../middlewares/user.middleware";
import {CertificationController} from "../controllers/certification.controller";
import {User} from "../models/user.model";

const certificationRouter = express.Router();

certificationRouter.get("/request/:certificateId", ensureLoggedIn, hasAdminRights, async (req, res) => {
    try {
        const certificateId = req.params.certificateId;
        const certificationController = CertificationController.getInstance();
        const certificationRequest = await certificationController.getRequestById(certificateId);
        res.json(certificationRequest);
    } catch (err) {
        res.status(404).json(err);
    }
});

certificationRouter.get("/requests", ensureLoggedIn, hasAdminRights, async (req, res) => {
    try {
        const certificationController = CertificationController.getInstance();
        const certificationRequests = await certificationController.getAllRequests();
        res.json(certificationRequests);
    } catch (err) {
        res.status(404).json(err);
    }
});

certificationRouter.get("/:certificationRequestId", ensureLoggedIn, hasAdminRights, async (req, res) => {
    try {
        const certificationRequestId = req.params.certificationRequestId;
        const certificationController = CertificationController.getInstance();
        const certification = await certificationController.approveRequest(certificationRequestId, req.user as User);
        res.json(certification);
    } catch (err) {
        res.status(404).json(err);
    }
});

certificationRouter.delete("/request/:certificationRequestId", ensureLoggedIn, hasAdminRights, async (req, res) => {
    try {
        const certificationRequestId = req.params.certificationRequestId;
        const certificationController = CertificationController.getInstance();
        const certification = await certificationController.rejectRequest(certificationRequestId);
        res.json(certification);
    } catch (err) {
        res.status(404).json(err);
    }
});

certificationRouter.post("/request", ensureLoggedIn, hasAdminRights, async (req, res) => {
    try {
        const certificationController = CertificationController.getInstance();
        const certificationRequest = await certificationController.requestCertification(req.user as User,{...req.body});
        res.json(certificationRequest);
    } catch (err) {
        res.status(404).json(err);
    }
});

export {
    certificationRouter
}
