import {Column, CreateDateColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {User} from "./user.model";

export class Ticket {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false, unique: true})
    title: string;

    @Column()
    description: string;

    @Column({
        type: "enum",
        enum: ["TODO", "OPEN", "CLOSED"],
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


    @ManyToOne(()=> User, user => user.createdTicket)
    userCreator: User;

    @ManyToOne( ()=> User, user => user.assignedTicket)
    userAssigned: User;
}
