import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {IsNotEmpty, Length} from "class-validator";
import {Project} from "./project.model";
import {Ticket} from "./ticket.model";
import {Comment} from "./comment.model";

@Entity({schema: "organization-app"})
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @IsNotEmpty()
    firstName: string;

    @Column()
    lastName: string;

    @Column({unique: true})
    username: string;

    @Column({unique: true})
    mail: string;

    @Column({select: false})
    @Length(7, 100)
    password: string;

    @Column({nullable: false})
    isAdmin: boolean;

    @ManyToMany(() => Project, project => project.usersMember)
    @JoinTable()
    projectsMember: Project[];

    @ManyToMany(() => Project, project => project.usersAdmin)
    @JoinTable()
    projectsAdmin: Project[];

    @OneToMany(() => Ticket, ticket => ticket.userCreator)
    createdTicket: Ticket[];

    @OneToMany(() => Ticket, ticket => ticket.userAssigned)
    assignedTicket: Ticket[];

    @OneToMany(() => Comment, comment => comment.user)
    comment: Comment[];
}
