import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "./user.model";
import {Certification} from "./certification.model";

export interface CertificationRequestProps {
    user: User;
    comment: string;
}

export enum CertificationRequestStatus {
    PENDING,
    ACCEPTED,
    REJECTED
}

@Entity()
export class CertificationRequest {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column()
    comment: string;
    @Column({
        type: "enum",
        enum: CertificationRequestStatus,
        default: CertificationRequestStatus.PENDING,
        nullable: false
    })
    certificationRequestStatus: CertificationRequestStatus;
    @OneToOne(() => User, user => user.certificationRequest, {nullable: false})
    @JoinColumn()
    user: User;
    @OneToOne(() => Certification, certification => certification.request, {nullable: true})
    @JoinColumn()
    certification: Certification;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
