import {getRepository, Repository} from "typeorm";
import {User} from "../models/user.model";
import {
    CertificationRequest,
    CertificationRequestProps,
    CertificationRequestStatus
} from "../models/certification_request.model";
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

    public async getById(certificationId: string): Promise<Certification> {
        return this.certificationRepository.findOneOrFail(certificationId);
    }

    public async getAll(): Promise<Certification[]> {
        return this.certificationRepository.find();
    }

    public async getRequestById(certificationRequestId: string): Promise<CertificationRequest> {
        return this.certificationRequestRepository.findOneOrFail(certificationRequestId);
    }

    public async getAllRequests(): Promise<CertificationRequest[]> {
        return this.certificationRequestRepository.find();
    }

    public async requestCertification(user: User, props: CertificationRequestProps): Promise<CertificationRequest> {
        const certificationRequest = this.certificationRequestRepository.create({...props, user});
        return await this.certificationRequestRepository.save(certificationRequest);
    }

    public async approveRequest(certificationRequestId: string, issuer: User): Promise<Certification> {
        let request = await this.getRequestById(certificationRequestId);
        request.certificationRequestStatus = CertificationRequestStatus.ACCEPTED;
        const user = await getRepository(User).createQueryBuilder()
            .leftJoin("User.certificationRequest", "CertificationRequest")
            .where("CertificationRequest.id=:certificationRequestId", {certificationRequestId})
            .getOne();
        const certificate = this.certificationRepository.create({user, issuer, request});
        return await this.certificationRepository.save(certificate);
    }

    public async rejectRequest(certificationRequestId: string): Promise<void> {
        await this.certificationRequestRepository.createQueryBuilder()
            .update()
            .set({certificationRequestStatus: CertificationRequestStatus.REJECTED})
            .where("id=:certificationRequestId", {certificationRequestId});
    }

    public async revokeCertificate(certificateId: string): Promise<void> {
        await this.certificationRepository.delete(certificateId);
    }
}
