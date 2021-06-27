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

@Entity()
export class Certification {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @OneToOne(() => User, user => user.certification)
    user: User;
    @ManyToOne(() => User, user => user.issuedCertifications)
    issuer: User;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
