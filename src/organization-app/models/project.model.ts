import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Ticket} from "./ticket.model";
import {Length} from "class-validator";
import {ProjectMembership} from "./project-membership.model";

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

    @OneToMany(() => ProjectMembership, projectMembership => projectMembership.project, {cascade: true})
    members: ProjectMembership[];

    @OneToMany(() => Ticket, ticket => ticket.project,{cascade: true})
    tickets: Ticket[];
}
