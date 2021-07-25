import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
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
import {IsEmail, IsNotEmpty, IsOptional, Length, MaxLength} from "class-validator";
import {hash} from "bcrypt";
import {Friendship} from "./friendship.model";
import {FriendRequest} from "./friend_request.model";
import {Organisation} from "./organisation.model";
import {CertificationRequest} from "./certification_request.model";
import {OrganisationCreationRequest} from "./organisation_creation_request.model";
import {Session} from "./session.model";

export enum UserType {
    USER = "USER",
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN"
}

export interface UserProps {
    username: string;
    lastname: string;
    firstname: string;
    mail: string;
    password: string;
    bio: string;
    userType?: UserType;
    profilePicture?: Media;
    bannerPicture?: Media;
}

@Entity()
export class User implements UserProps {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Length(5, 20)
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
    @Column({unique: false, nullable: false, select: false})
    password: string;
    @IsOptional()
    @MaxLength(200)
    @Column({nullable: true, length: 200})
    bio: string;
    @Column({select: false, nullable: true})
    resetToken: string;
    @Column({select: false, nullable: true})
    resetTokenExpiration: Date;
    @Column({type: "enum", enum: UserType, default: UserType.USER, nullable: false})
    userType: UserType;
    @OneToMany(() => Friendship, friendship => friendship.friendOne, {cascade: true, onDelete:"SET NULL"})
    friendsOne: Friendship[];
    @OneToMany(() => Friendship, friendship => friendship.friendTwo, {cascade: true,  onDelete:"SET NULL"})
    friendsTwo: Friendship[];
    @OneToMany(() => FriendRequest, friendRequest => friendRequest.user, {cascade: true,  onDelete: "SET NULL"})
    friendRequests: FriendRequest[];
    @OneToMany(() => FriendRequest, friendRequest => friendRequest.sender, {cascade: true,  onDelete: "SET NULL"})
    requestedFriends: FriendRequest[];
    @ManyToMany(() => User, user => user.blockedUsers, {onDelete:"CASCADE"})
    blockers: User[];
    @ManyToMany(() => User, user => user.blockers, {cascade: true})
    @JoinTable()
    blockedUsers: User[];
    @ManyToMany(() => Post, post => post.likes, {cascade: true})
    @JoinTable()
    likedPosts: Post[];
    @OneToMany(() => Post, post => post.creator, {cascade: true, onDelete:"SET NULL"})
    createdPosts: Post[];
    @OneToMany(() => Comment, comment => comment.creator, {cascade: true, onDelete:"SET NULL"})
    comments: Comment[];
    @OneToOne(() => Media, media => media.userProfilePicture, {nullable: true, eager: true,cascade: true,   onDelete:'SET NULL'})
    @JoinColumn()
    profilePicture: Media;
    @OneToOne(() => Media, media => media.userBanner, {nullable: true, eager: true,cascade: true, onDelete:'SET NULL'})
    @JoinColumn()
    bannerPicture: Media;
    @OneToOne(() => Certification, certification => certification.user, {
        cascade: true,
        eager: true,
        onDelete: "SET NULL"
    })
    @JoinColumn()
    certification: Certification;
    @OneToOne(() => CertificationRequest, certification => certification.user, {cascade: true, onDelete:"SET NULL"})
    certificationRequest: CertificationRequest;
    @OneToMany(() => Certification, certification => certification.issuer)
    issuedCertifications: Certification[];
    @OneToMany(() => GroupMembership, group => group.user, {cascade: true})
    groups: GroupMembership[];
    @OneToMany(() => Event, event => event.user)
    createdEvents: Event[];
    @ManyToMany(() => Event, event => event.participants, {cascade: true})
    @JoinTable()
    eventsParticipation: Event[];
    @OneToOne(() => OrganisationCreationRequest, organisationCreationRequest => organisationCreationRequest.user)
    organisationCreationRequest: OrganisationCreationRequest;
    @OneToMany(() => OrganisationMembership, organisation => organisation.user, {cascade: true, onDelete:"SET NULL"})
    organisations: OrganisationMembership[];
    @ManyToMany(() => Organisation, organisation => organisation.invitedUsers, {onDelete: "SET NULL"})
    organisationInvitations: Organisation[];
    @ManyToMany(() => Organisation, organisation => organisation.followers)
    @JoinTable()
    followedOrganisations: Organisation[];
    @OneToMany(() => Message, message => message.user, {cascade: true})
    messages: Message[];
    @OneToMany(() => Report, report => report.userReporter, {cascade: true, onDelete:"SET NULL"})
    reports: Report[];
    @OneToMany(() => Report, report => report.reportedUser, {cascade: true, onDelete:'SET NULL'})
    reported: Report[];
    @OneToMany(() => Session, session => session.user, {cascade: true, onDelete:'SET NULL'})
    sessions: Session[];
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
