import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Post} from "./post.model";
import {Organisation} from "./organisation.model";
import {Conversation} from "./conversation.model";
import {Message} from "./message.model";
import {Certification} from "./certification.model";
import {Media} from "./media.model";
import {Group} from "./group.model";
import {Comment} from "./comment.model";
import {Event} from "./event.model";
import {Report} from "./report.model";

export enum UserType {
    USER,
    ADMIN,
    SUPER_ADMIN
}

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column({unique: true, nullable: false})
    username: string;
    @Column({unique: false, nullable: true})
    firstname: string;
    @Column({unique: false, nullable: true})
    lastname: string;
    @Column({unique: true, nullable: false})
    mail: string;
    @Column({unique: true, nullable: false})
    password: string;
    @Column({type: "enum", enum: UserType, unique: true, nullable: false})
    userType: UserType;
    @ManyToMany(() => User, user => user.friends)
    @JoinTable()
    friends: User[];
    @ManyToMany(() => User, user => user.blockedUsers)
    blockers: User[];
    @ManyToMany(() => User, user => user.blockers)
    @JoinTable()
    blockedUsers: User[];
    @ManyToMany(() => Post, post => post.likes)
    @JoinTable()
    likedPosts: Post[];
    @ManyToMany(() => Post, post => post.creator)
    @JoinTable()
    createdPosts: Post[];
    @OneToMany(() => Comment, comment => comment.creator)
    comments: Comment[];
    @OneToOne(() => Media, media => media.userProfilePicture)
    profilePicture: Media;
    @OneToOne(() => Media, media => media.userBanner)
    bannerPicture: Media;
    @OneToOne(() => Certification, certification => certification.user, {eager: true})
    certification: Certification;
    @OneToMany(() => Certification, certification => certification.issuer)
    issuedCertifications: Certification[];
    @ManyToMany(() => Group, group => group.users)
    @JoinTable()
    groups: Group[];
    @ManyToMany(() => Group, group => group.admins)
    @JoinTable()
    administratedGroups: Group[];
    @ManyToMany(() => Event, event => event.user)
    @JoinTable()
    createdEvents: Event[];
    @ManyToMany(() => Event, event => event.participants)
    @JoinTable()
    eventsParticipation: Event[];
    @ManyToMany(() => Organisation, organisation => organisation.members)
    @JoinTable()
    organisations: Organisation[];
    @ManyToMany(() => Organisation, organisation => organisation.admins)
    @JoinTable()
    administratedOrganisations: Organisation[];
    @ManyToMany(() => Conversation, conversation => conversation.members)
    @JoinTable()
    conversations: Conversation[];
    @OneToMany(() => Message, message => message.user)
    messages: Message[];
    @OneToMany(() => Report, report => report.userReporter)
    reports: Report[];
    @OneToMany(() => Report, report => report.reportedUser)
    reported: Report[];
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
