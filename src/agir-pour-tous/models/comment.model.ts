import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Post} from "./post.model";
import {User} from "./user.model";

export interface CommentProps{
    text: String
}

@Entity({schema: "agir_pour_tous"})
export class Comment implements CommentProps{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: false
    })
    text: String;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToMany(() => Post, post => post.comments)
    posts: Post[];

    @ManyToOne(() => User, user => user.comments)
    user: User;
}
