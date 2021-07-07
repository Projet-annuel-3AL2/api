import {User} from "./user.model";
import {
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {CertificationRequest} from "./certification_request.model";

@Entity()
export class Certification {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @OneToOne(() => User, user => user.certification)
    user: User;
    @ManyToOne(() => User, user => user.issuedCertifications)
    issuer: User;
    @OneToOne(() => CertificationRequest, request => request.certification)
    request: CertificationRequest;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
