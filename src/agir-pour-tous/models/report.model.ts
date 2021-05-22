import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "./user.model";
import {Organisation} from "./organisation.model";
import {Group} from "./group.model";
import {Post} from "./post.model";
import {Event} from "./event.model";
import {IsNotEmpty, Length} from "class-validator";

@Entity()
export class Report {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @ManyToOne(() => User, user => user.reports)
    userReporter: User;
    @IsNotEmpty()
    @Length(5, 500)
    @Column({length: 500, nullable: false})
    text: string;
    @OneToMany(() => User, user => user.reported)
    reportedUser: User;
    @OneToMany(() => Organisation, organisation => organisation.reported)
    reportedOrganisation: Organisation;
    @OneToMany(() => Group, group => group.reported)
    reportedGroup: Group;
    @OneToMany(() => Post, post => post.reported)
    reportedPost: Post;
    @OneToMany(() => Event, event => event.reported)
    reportedEvent: Event;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
