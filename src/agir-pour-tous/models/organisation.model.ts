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
import {Media} from "./media.model";
import {Conversation} from "./conversation.model";
import {Post} from "./post.model";
import {Event} from "./event.model";
import {Report} from "./report.model";
import {OrganisationMembership} from "./organisation_membership.model";

@Entity()
export class Organisation {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column({nullable: false, unique: true})
    name: string;
    @ManyToMany(() => OrganisationMembership, user => user.organisation)
    members: OrganisationMembership[];
    @OneToMany(() => Event, user => user.organisation)
    events: Event[];
    @OneToOne(() => Media, media => media.organisationProfilePicture)
    profilePicture: Media;
    @OneToOne(() => Media, media => media.organisationBannerPicture)
    bannerPicture: Media;
    @OneToOne(() => Conversation, conversation => conversation.organisation)
    conversation: Conversation;
    @OneToMany(() => Post, post => post.organisation)
    posts: Post[];
    @OneToMany(() => Report, report => report.reportedOrganisation)
    reported: Report[];
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
