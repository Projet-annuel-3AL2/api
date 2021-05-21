import {Post} from "./post.model";
import {CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Report} from "./report.model";
import {GroupMembership} from "./group-membership.model";

@Entity()
export class Group {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @OneToMany(() => GroupMembership, user => user.group)
    members: GroupMembership[];
    @OneToMany(() => Post, post => post.group)
    posts: Post[];
    @OneToMany(() => Report, report => report.reportedGroup)
    reported: Report[];
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
