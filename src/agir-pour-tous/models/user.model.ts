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
import {Message} from "./message.model";
import {Certification} from "./certification.model";
import {Media} from "./media.model";
import {Comment} from "./comment.model";
import {Event} from "./event.model";
import {Report} from "./report.model";
import {GroupMembership} from "./group_membership.model";
import {OrganisationMembership} from "./organisation_membership.model";
import {IsEmail, IsNotEmpty, Length} from "class-validator";
import {Friendship} from "./friendship.model";

export enum UserType {
    USER,
    ADMIN,
    SUPER_ADMIN
}

export interface UserProps {
    username: string;
    firstname: string;
    lastname: string;
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
    @Column({type: "enum", enum: UserType, unique: true, default: UserType.USER, nullable: false})
    userType: UserType;
    @OneToMany(() => User, user => user.friends, {cascade: true})
    friends: Friendship[];
    @ManyToMany(() => User, user => user.blockedUsers)
    blockers: User[];
    @ManyToMany(() => User, user => user.blockers, {cascade: true})
    @JoinTable()
    blockedUsers: User[];
    @ManyToMany(() => Post, post => post.likes, {cascade: true})
    @JoinTable()
    likedPosts: Post[];
    @OneToMany(() => Post, post => post.creator, {cascade: true})
    createdPosts: Post[];
    @OneToMany(() => Comment, comment => comment.creator, {cascade: true})
    comments: Comment[];
    @OneToOne(() => Media, media => media.userProfilePicture, {nullable: true, cascade: true})
    profilePicture: Media;
    @OneToOne(() => Media, media => media.userBanner, {nullable: true, cascade: true})
    bannerPicture: Media;
    @OneToOne(() => Certification, certification => certification.user, {eager: true, cascade: true})
    certification: Certification;
    @OneToMany(() => Certification, certification => certification.issuer)
    issuedCertifications: Certification[];
    @OneToMany(() => GroupMembership, group => group.user, {cascade: true})
    groups: GroupMembership[];
    @OneToMany(() => Event, event => event.user)
    createdEvents: Event[];
    @ManyToMany(() => Event, event => event.participants, {cascade: true})
    @JoinTable()
    eventsParticipation: Event[];
    @OneToMany(() => OrganisationMembership, organisation => organisation.user, {cascade: true})
    organisations: OrganisationMembership[];
    @OneToMany(() => Message, message => message.user, {cascade: true})
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
