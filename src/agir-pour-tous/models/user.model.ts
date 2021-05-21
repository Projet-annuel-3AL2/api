import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
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
    friends: User[];
    @ManyToMany(() => User, user => user.blockedUsers)
    blockers: User[];
    @ManyToMany(() => User, user => user.blockers)
    blockedUsers: User[];
    @ManyToMany(() => Post, post => post.likes)
    likedPosts: Post[];
    @ManyToMany(() => Post, post => post.creator)
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
    groups: Group[];
    @ManyToMany(() => Group, group => group.admins)
    administratedGroups: Group[];
    @ManyToMany(() => Event, event => event.user)
    createdEvents: Event[];
    @ManyToMany(() => Event, event => event.participants)
    eventsParticipation: Event[];
    @ManyToMany(() => Organisation, organisation => organisation.members)
    organisations: Organisation[];
    @ManyToMany(() => Organisation, organisation => organisation.admins)
    administratedOrganisations: Organisation[];
    @ManyToMany(() => Conversation, conversation => conversation.members)
    conversations: Conversation[];
    @OneToMany(() => Message, message => message.user)
    messages: Message[];
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
