import {Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, UpdateDateColumn} from "typeorm";
import {User} from "./user.model";
import {Organisation} from "./organisation.model";

@Entity()
export class OrganisationMembership {
    @ManyToOne(() => User, user => user.organisations, {primary: true})
    user: User;
    @ManyToOne(() => Organisation, organisation => organisation.members, {primary: true})
    organisation: Organisation;
    @Column({default: false, nullable: false})
    isAdmin: boolean;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
