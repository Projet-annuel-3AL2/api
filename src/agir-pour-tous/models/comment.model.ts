import {Post} from "./post.model";
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
import {Length} from "class-validator";
import {Report} from "./report.model";

export interface CommentProps {
    text: string;
    medias?: Media[];
}

@Entity()
export class Comment {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @ManyToOne(() => User, user => user.comments, {nullable: false, eager: true})
    creator: User;
    @ManyToOne(() => Post, post => post.comments)
    post: Post;
    @Length(0, 512)
    @Column()
    text: string;
    @OneToMany(() => Media, media => media.comments, {cascade: true, eager: true})
    medias: Media[];
    @OneToMany(() => Report, report => report.reportedComment, {cascade: true})
    reported: Report[];
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
