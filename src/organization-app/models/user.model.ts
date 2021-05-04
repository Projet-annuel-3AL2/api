import {Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {IsEmail, IsNotEmpty, Length} from "class-validator";
import {Ticket} from "./ticket.model";
import {Comment} from "./comment.model";
import {ProjectMembership} from "./project-membership.model";

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
    firstname: string;

    @Column()
    @IsNotEmpty()
    lastname: string;

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

    @ManyToMany(() => ProjectMembership, projectMembership => projectMembership.project)
    projects: ProjectMembership[];

    @OneToMany(() => Ticket, ticket => ticket.creator)
    createdTickets: Ticket[];

    @OneToMany(() => Ticket, ticket => ticket.assignee)
    assignedTickets: Ticket[];

    @OneToMany(() => Comment, comment => comment.user)
    comments: Comment[];
}
