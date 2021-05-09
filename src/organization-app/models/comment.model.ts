import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Ticket} from "./ticket.model";
import {User} from "./user.model";

export interface CommentProps {
    text: string;
}

@Entity({schema: "organization-app"})
export class Comment implements CommentProps {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    text: string;

    @CreateDateColumn()
    creationDate: Date;

    @Column({nullable: true})
    commentId: string;
    @ManyToOne(() => Ticket, ticket => ticket.comments)
    ticket: Ticket;

    @Column({nullable: true})
    userId: string;
    @ManyToOne(() => User, user => user.comments)
    user: User;
}
