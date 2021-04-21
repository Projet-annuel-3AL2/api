import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
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

@Entity({schema: "organization-app"})
export class Ticket {

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
    status: string;

    @Column()
    endDate: Date;

    @Column()
    estimatedDuration: number;

    @Column()
    priority: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @ManyToOne(() => User, user => user.createdTickets)
    creator: User;

    @ManyToOne(() => User, user => user.assignedTickets)
    assignee: User;

    @OneToMany(() => Comment, comment => comment.ticket)
    comments: Comment[];

    @ManyToOne(() => Project, project => project.tickets)
    project: Project;
}
