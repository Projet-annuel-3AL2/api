import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn, JoinTable,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Media} from "./media.model";
import {Conversation} from "./conversation.model";
import {Post} from "./post.model";
import {Event} from "./event.model";
import {Report} from "./report.model";
import {OrganisationMembership} from "./organisation_membership.model";
import {IsNotEmpty, Length} from "class-validator";
import {User} from "./user.model";

export interface OrganisationProps {
    name: string;
    owner: User;
}

export interface OrganisationProps {
    name: string;
}

@Entity()
export class Organisation {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @IsNotEmpty()
    @Length(5, 30)
    @Column({nullable: false, unique: true})
    name: string;
    @OneToMany(() => OrganisationMembership, user => user.organisation)
    members: OrganisationMembership[];
    @ManyToMany(() => User, user => user.organisationInvitations, {cascade: true})
    invitedUsers: User[];
    @ManyToMany(() => User, user => user.followedOrganisations, {cascade: true})
    @JoinTable()
    followers: User[];
    @OneToMany(() => Event, user => user.organisation, {cascade: true})
    events: Event[];
    @OneToOne(() => Media, media => media.organisationProfilePicture, {nullable: true, cascade: true, eager: true})
    @JoinColumn()
    profilePicture: Media;
    @OneToOne(() => Media, media => media.organisationBannerPicture, {nullable: true, cascade: true, eager: true})
    @JoinColumn()
    bannerPicture: Media;
    @OneToOne(() => Conversation, conversation => conversation.organisation, {nullable: false, cascade: true})
    @JoinColumn()
    conversation: Conversation;
    @OneToMany(() => Post, post => post.organisation, {cascade: true})
    posts: Post[];
    @OneToMany(() => Report, report => report.reportedOrganisation, {cascade: true})
    reported: Report[];
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;

    @BeforeInsert()
    async setConversation() {
        this.conversation = new Conversation();
    }
}
