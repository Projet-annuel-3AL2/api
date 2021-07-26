import {Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, UpdateDateColumn} from "typeorm";
import {User} from "./user.model";
import {Organisation} from "./organisation.model";

export enum OrganisationMembershipStatus {
    NONE,
    PENDING,
    RECEIVED,
    JOINED
}

@Entity()
export class OrganisationMembership {
    @ManyToOne(() => User, user => user.organisations, {primary: true, onDelete:"CASCADE"})
    user: User;
    @ManyToOne(() => Organisation, organisation => organisation.members, {primary: true, onDelete:"CASCADE"})
    organisation: Organisation;
    @Column({default: false, nullable: false})
    isAdmin: boolean;
    @Column({default: false, nullable: false})
    isOwner: boolean;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
