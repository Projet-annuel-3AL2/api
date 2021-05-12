import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Ticket} from "./ticket.model";
import {User} from "./user.model";

export interface CommentProps {
    text: string;
}

@Entity({schema: "organization_app"})
export class Comment implements CommentProps {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    text: string;

    @CreateDateColumn()
    creationDate: Date;

    @ManyToOne(() => Ticket, ticket => ticket.comments)
    ticket: Ticket;

    @ManyToOne(() => User, user => user.comments)
    user: User;
}
