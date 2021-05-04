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

@Entity({schema: "organization_app"})
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
    created_at: Date;

    @UpdateDateColumn()
    update_at: Date;

    @ManyToOne(() => User, user => user.createdTicket)
    userCreator: User;

    @ManyToOne(() => User, user => user.assignedTicket)
    userAssigned: User;

    @OneToMany(() => Comment, comment => comment.ticket)
    comment: Comment[];

    @ManyToOne(() => Project, project => project.tickets)
    project: Project;
}
