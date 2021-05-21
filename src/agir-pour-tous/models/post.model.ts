import {User} from "./user.model";
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
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
    @OneToMany(() => Event, event => event.posts)
    sharedEvent: Event;
    @OneToMany(() => Post, post => post.sharesPost)
    sharedPosts: Post[];
    @ManyToOne(() => Post, post => post.sharedPosts)
    sharesPost: Post;
    @ManyToOne(() => User, user => user.likedPosts)
    likes: User[];
    @OneToMany(() => Comment, comment => comment.post)
    comments: Comment[];
    @OneToMany(() => Report, report => report.reportedPost)
    reported: Report[];
    @Column()
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
