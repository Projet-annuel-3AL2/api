import {User} from "./user.model";
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Media} from "./media.model";
import {Organisation} from "./organisation.model";
import {Group} from "./group.model";
import {Comment} from "./comment.model";
import {Event} from "./event.model";
import {Report} from "./report.model";
import {Length} from "class-validator";

export interface PostProps {
    text: string;
    creator: User;
    group?: Group;
    organisation?: Organisation;
    sharedEvent?: Event;
    sharedPost?: Post;
}

@Entity()
export class Post {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @ManyToOne(() => User, user => user.createdPosts)
    creator: User;
    @ManyToOne(() => Organisation, organisation => organisation.posts)
    organisation: Organisation;
    @ManyToOne(() => Group, group => group.posts)
    group: Group;
    @ManyToOne(() => Event, event => event.posts)
    sharedEvent: Event;
    @OneToMany(() => Post, post => post.sharesPost)
    sharedPosts: Post[];
    @ManyToOne(() => Post, post => post.sharedPosts)
    sharesPost: Post;
    @ManyToMany(() => User, user => user.likedPosts)
    likes: User[];
    @OneToMany(() => Comment, comment => comment.post, {cascade: true})
    comments: Comment[];
    @OneToMany(() => Report, report => report.reportedPost)
    reported: Report[];
    @Length(0, 512)
    @Column({nullable: true, length: 512})
    text: string;
    @OneToMany(() => Media, media => media.post)
    medias: Media[];
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
