import {
    BeforeInsert,
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
import {Media} from "./media.model";
import {Conversation} from "./conversation.model";
import {Post} from "./post.model";
import {Event} from "./event.model";
import {Report} from "./report.model";
import {OrganisationMembership} from "./organisation_membership.model";
import {IsNotEmpty, Length} from "class-validator";

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
    @ManyToMany(() => OrganisationMembership, user => user.organisation)
    members: OrganisationMembership[];
    @OneToMany(() => Event, user => user.organisation, {cascade: true})
    events: Event[];
    @OneToOne(() => Media, media => media.organisationProfilePicture, {nullable: true, cascade: true})
    profilePicture: Media;
    @OneToOne(() => Media, media => media.organisationBannerPicture, {nullable: true, cascade: true})
    bannerPicture: Media;
    @OneToOne(() => Conversation, conversation => conversation.organisation, {nullable: false, cascade: true})
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
