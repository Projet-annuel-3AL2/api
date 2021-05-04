import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {IsEmail, IsNotEmpty, Length} from "class-validator";
import {Project} from "./project.model";
import {Ticket} from "./ticket.model";
import {Comment} from "./comment.model";

export interface UserProps {
    firstname: string;
    lastname: string;
    username: string;
    mail: string;
    password: string;
    isAdmin?: boolean;
}

@Entity({schema: "organization_app"})
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @IsNotEmpty()
    firstName: string;

    @Column()
    @IsNotEmpty()
    lastName: string;

    @Column({unique: true})
    @IsNotEmpty()
    username: string;

    @Column({unique: true})
    @IsNotEmpty()
    @IsEmail()
    mail: string;

    @Column({select: false})
    @IsNotEmpty()
    @Length(7, 100)
    password: string;

    @Column({nullable: false, default: false})
    isAdmin: boolean;

    @ManyToMany(() => Project, project => project.members)
    @JoinTable()
    projectsMember: Project[];

    @ManyToMany(() => Project, project => project.admins)
    @JoinTable()
    projectsAdmin: Project[];

    @OneToMany(() => Ticket, ticket => ticket.creator)
    createdTickets: Ticket[];

    @OneToMany(() => Ticket, ticket => ticket.assignee)
    assignedTickets: Ticket[];

    @OneToMany(() => Comment, comment => comment.user)
    comments: Comment[];
}
