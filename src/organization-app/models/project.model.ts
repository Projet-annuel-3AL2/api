import {Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.model";
import {Ticket} from "./ticket.model";
import {Length} from "class-validator";

export interface ProjectProps {
    name: string;
}

@Entity({schema: "organization_app"})
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({length: 100, nullable: false, unique: true})
    @Length(5, 100)
    name: string;

    @ManyToMany(() => User, user => user.projectsMember)
    members: User[];

    @ManyToMany(() => User, user => user.projectsAdmin)
    admins: User[];

    @OneToMany(() => Ticket, ticket => ticket.project)
    tickets: Ticket[];
}
