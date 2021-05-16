import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import {User} from "./user.model";
import {Event} from "./event.model";
import {Comment} from "./comment.model";

export interface PostProps{
    title: string,
    text: string
}

@Entity({schema: "agir_pour_tous"})
export class Post implements PostProps{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column( {
        nullable: false
    })
    title: string;

    @Column({
        nullable: false
    })
    text: string;

    @CreateDateColumn()
    created_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => User, user => user.posts)
    owner: User;

    @ManyToOne(() => Event, event => event.posts)
    event:  Event;

    @ManyToMany(() => Comment, comment => comment.posts)
    comments: Comment[];
}
