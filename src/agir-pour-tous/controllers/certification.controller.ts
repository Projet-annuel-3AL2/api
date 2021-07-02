import {getRepository, Repository} from "typeorm";
import {User} from "../models/user.model";
import {CertificationRequest, CertificationRequestProps} from "../models/certification_request.model";
import {Certification} from "../models/certification.model";

export class CertificationController {

    private static instance: CertificationController;

    private certificationRequestRepository: Repository<CertificationRequest>;
    private certificationRepository: Repository<Certification>;

    private constructor() {
        this.certificationRequestRepository = getRepository(CertificationRequest);
        this.certificationRepository = getRepository(Certification);
    }

    public static getInstance(): CertificationController {
        if (CertificationController.instance === undefined) {
            CertificationController.instance = new CertificationController();
        }
        return CertificationController.instance;
    }

    public async requestCertification(user: User, props: CertificationRequestProps): Promise<CertificationRequest> {
        const certificationRequest = this.certificationRequestRepository.create({...props, user});
        return await this.certificationRequestRepository.save(certificationRequest);
    }

    public async acceptRequest(certificationRequestId: string): Promise<Certification> {

    }

    public async rejectRequest(certificationRequestId: string): Promise<void> {
        await this.certificationRequestRepository.softDelete(certificationRequestId);
    }
}
