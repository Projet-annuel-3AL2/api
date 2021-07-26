import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "./user.model";
import {Organisation} from "./organisation.model";
import {Group} from "./group.model";
import {Post} from "./post.model";
import {Event} from "./event.model";
import {Length} from "class-validator";
import {Comment} from "./comment.model";

export interface ReportProps {
    text: string;
    userReporter: User;
    reportedUser?: User;
    reportedGroup?: Group;
    reportedPost?: Post;
    reportedOrganisation?: Organisation;
    reportedEvent?: Event;
    reportedComment?: Comment;
}

@Entity()
export class Report {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @ManyToOne(() => User, user => user.reports, {onDelete:"CASCADE"})
    userReporter: User;
    @Length(0, 500)
    @Column({length: 500, nullable: false})
    text: string;
    @ManyToOne(() => User, user => user.reported, {onDelete:"CASCADE"})
    reportedUser: User;
    @ManyToOne(() => Organisation, organisation => organisation.reported, {onDelete:"CASCADE"})
    reportedOrganisation: Organisation;
    @ManyToOne(() => Group, group => group.reported, {onDelete:"CASCADE"})
    reportedGroup: Group;
    @ManyToOne(() => Post, post => post.reported, {onDelete:"CASCADE"})
    reportedPost: Post;
    @ManyToOne(() => Event, event => event.reported, {onDelete:"CASCADE"})
    reportedEvent: Event;
    @ManyToOne(() => Comment, comment => comment.reported, {onDelete: "CASCADE"})
    reportedComment: Comment;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
