import {
    BeforeInsert,
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
import {Conversation} from "./conversation.model";
import {Message} from "./message.model";
import {Certification} from "./certification.model";
import {Media} from "./media.model";
import {Comment} from "./comment.model";
import {Event} from "./event.model";
import {Report} from "./report.model";
import {GroupMembership} from "./group-membership.model";
import {OrganisationMembership} from "./organisation_membership.model";
import {IsEmail, IsNotEmpty, Length} from "class-validator";
import {hash} from "bcrypt";

export enum UserType {
    USER="USER",
    ADMIN="ADMIN",
    SUPER_ADMIN="SUPER_ADMIN"
}

export interface UserProps {
    username: string;
    lastname: string;
    firstname: string;
    mail: string;
    password: string;
    userType?: UserType;
}

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Length(5,20)
    @IsNotEmpty()
    @Column({unique: true, nullable: false, length: 20})
    username: string;
    @Column({unique: false, nullable: true})
    firstname: string;
    @Column({unique: false, nullable: true})
    lastname: string;
    @IsEmail()
    @Column({unique: true, nullable: false})
    mail: string;
    @Column({unique: true, nullable: false})
    password: string;
    @Column({type: "enum", enum: UserType, default: UserType.USER, nullable: false})
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
    @OneToMany(() => Post, post => post.creator)
    createdPosts: Post[];
    @OneToMany(() => Comment, comment => comment.creator)
    comments: Comment[];
    @OneToOne(() => Media, media => media.userProfilePicture, {nullable: true})
    profilePicture: Media;
    @OneToOne(() => Media, media => media.userBanner, {nullable: true})
    bannerPicture: Media;
    @OneToOne(() => Certification, certification => certification.user, {eager: true})
    certification: Certification;
    @OneToMany(() => Certification, certification => certification.issuer)
    issuedCertifications: Certification[];
    @OneToMany(() => GroupMembership, group => group.user)
    groups: GroupMembership[];
    @OneToMany(() => Event, event => event.user)
    createdEvents: Event[];
    @ManyToMany(() => Event, event => event.participants)
    @JoinTable()
    eventsParticipation: Event[];
    @OneToMany(() => OrganisationMembership, organisation => organisation.user)
    organisations: OrganisationMembership[];
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

    @BeforeInsert()
    async setPassword(password: string) {
        this.password = await hash(password || this.password, 10)
    }
}
