import {Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.model";
import {Ticket} from "./ticket.model";

@Entity({schema: "organization-app"})
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false, unique: true})
    name: string;

    @ManyToMany(() => User, user => user.projectsMember)
    members: User[];

    @ManyToMany(() => User, user => user.projectsAdmin)
    admins: User[];

    @OneToMany(() => Ticket, ticket => ticket.project)
    tickets: Ticket[];
}
