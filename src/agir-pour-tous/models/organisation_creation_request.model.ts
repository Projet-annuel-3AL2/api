import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "./user.model";

export class OrganisationCreationRequest {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column()
    comment: string;
    @OneToOne(()=>User,user=>user.organisationCreationRequest, {nullable:false})
    @JoinColumn()
    user: User;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
