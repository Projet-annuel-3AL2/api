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

export interface CommentProps {
    creator: User;
    post: Post;
    text: string;
    medias: Media[];
}

@Entity()
export class Comment {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @ManyToOne(() => User, user => user.comments, {nullable: false})
    creator: User;
    @ManyToOne(() => Post, post => post.comments)
    post: Post;
    @Length(0, 512)
    @Column()
    text: string;
    @OneToMany(() => Media, media => media.comments, {cascade: true})
    medias: Media[];
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
