import {Column, Entity, ManyToOne} from "typeorm";
import {User} from "./user.model";
import {Project} from "./project.model";

@Entity({schema: "organization_app"})
export class ProjectMembership {
    @ManyToOne(() => User, user => user.projects, {primary: true})
    member: User;

    @ManyToOne(() => Project, project => project.members, {primary: true})
    project: Project;

    @Column({nullable: false, default: false})
    isAdmin: boolean;
}
