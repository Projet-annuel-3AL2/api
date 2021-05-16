import {Column, Entity, ManyToOne, RelationId} from "typeorm";
import {User} from "./user.model";
import {Project} from "./project.model";

@Entity({schema: "organization_app"})
export class ProjectMembership {
    @ManyToOne(() => User, user => user.projects, {primary: true})
    member: User;
    @Column({primary: true})
    @RelationId((projectMembership: ProjectMembership) => projectMembership.member)
    memberId: string;

    @ManyToOne(() => Project, project => project.members, {primary: true})
    project: Project;
    @Column({primary: true})
    @RelationId((projectMembership: ProjectMembership) => projectMembership.project)
    projectId: string;

    @Column({nullable: false, default: false})
    isAdmin: boolean;
}
