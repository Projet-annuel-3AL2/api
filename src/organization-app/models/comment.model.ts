import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Ticket} from "./ticket.model";
import {User} from "./user.model";

@Entity({schema: "organization-app"})
export class Comment {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    text: string;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => Ticket, ticket => ticket.comments)
    ticket: Ticket;

    @ManyToOne(() => User, user => user.comments)
    user: User;
}
