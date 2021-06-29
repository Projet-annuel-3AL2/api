import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    RelationId,
    UpdateDateColumn
} from "typeorm";
import {User} from "./user.model";
import {Comment} from "./comment.model";
import {Project} from "./project.model";

export enum TicketStatus {
    TODO = "TODO",
    OPEN = "OPEN",
    CLOSED = "CLOSED"
}

export interface TicketProps {
    title: string;
    description: string;
    status: TicketStatus;
    endDate?: Date;
    estimatedDuration: number;
    priority: number;
    project: Project;
}

@Entity({schema: "organization_app"})
export class Ticket implements TicketProps {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false, unique: true})
    title: string;

    @Column()
    description: string;

    @Column({
        type: "enum",
        enum: TicketStatus,
        default: "TODO"
    })
    status: TicketStatus;

    @Column({nullable: true})
    endDate: Date;

    @Column({nullable: true})
    estimatedDuration: number;

    @Column({default: 0})
    priority: number;

    @CreateDateColumn()
    creationDate: Date;

    @UpdateDateColumn()
    updateDate: Date;

    @ManyToOne(() => User, user => user.createdTickets, {onDelete: "SET NULL"})
    creator: User;
    @Column()
    @RelationId((ticket: Ticket) => ticket.creator)
    creatorId: string;

    @ManyToOne(() => User, user => user.assignedTickets, {nullable: true, onDelete: "SET NULL"})
    assignee: User;
    @Column()
    @RelationId((ticket: Ticket) => ticket.assignee)
    assigneeId: string;

    @OneToMany(() => Comment, comment => comment.ticket, {cascade: true})
    comments: Comment[];

    @ManyToOne(() => Project, project => project.tickets, {onDelete: "CASCADE"})
    project: Project;
    @Column()
    @RelationId((ticket: Ticket) => ticket.project)
    projectId: string;
}
