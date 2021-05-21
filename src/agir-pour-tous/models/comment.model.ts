import {Post} from "./post.model";
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

@Entity()
export class Comment {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @ManyToOne(() => User, user => user.comments)
    creator: User;
    @ManyToMany(() => Post, post => post.comments)
    post: Post;
    @Column({nullable: true})
    text: string;
    @OneToMany(() => Media, media => media.comments)
    medias: Media[];
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
