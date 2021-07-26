import {Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, UpdateDateColumn} from "typeorm";
import {Group} from "./group.model";
import {User} from "./user.model";

@Entity()
export class GroupMembership {
    @ManyToOne(() => User, user => user.groups, {primary: true, onDelete:'CASCADE'})
    user: User;
    @ManyToOne(() => Group, group => group.members, {primary: true})
    group: Group;
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
