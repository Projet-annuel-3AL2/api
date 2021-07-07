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

export interface OrganisationCreationRequestProps {
    comment: string;
    user: User;
}

@Entity()
export class OrganisationCreationRequest {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column({nullable: false, unique: true})
    name: string;
    @Column()
    comment: string;
    @OneToOne(() => User, user => user.organisationCreationRequest, {nullable: false, eager: true})
    @JoinColumn()
    user: User;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
