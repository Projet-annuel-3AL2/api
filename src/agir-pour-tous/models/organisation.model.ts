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
import {User} from "./user.model";
import {Media} from "./media.model";
import {Conversation} from "./conversation.model";
import {Post} from "./post.model";
import {Event} from "./event.model";

@Entity()
export class Organisation {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column({nullable: false, unique: true})
    name: string;
    @ManyToMany(() => User, user => user.administratedOrganisations)
    admins: User[];
    @ManyToMany(() => User, user => user.organisations)
    members: User[];
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
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
