import {User} from "../models/user.model";
import {getRepository, Repository} from "typeorm";
import {validate} from "class-validator";
import {Project, ProjectProps} from "../models/project.model";
import {Ticket, TicketProps} from "../models/ticket.model";
import {ProjectMembership} from "../models/project-membership.model";

export class ProjectController {

    private static instance: ProjectController;

    private projectRepository: Repository<Project>;
    private projectMembershipRepository: Repository<ProjectMembership>;

    private constructor() {
        this.projectRepository = getRepository(Project);
        this.projectMembershipRepository = getRepository(ProjectMembership);
    }

    public static async getInstance(): Promise<ProjectController> {
        if (ProjectController.instance === undefined) {
            ProjectController.instance = new ProjectController();
        }
        return ProjectController.instance;
    }

    public async create(props: ProjectProps, user: User): Promise<Project> {
        let project = this.projectRepository.create({...props});
        const err = await validate(project, {validationError: {target: false}});
        if (err.length > 0) {
            throw err;
        }
        project = await this.projectRepository.save(project);
        const membership = this.projectMembershipRepository.create({member: user, isAdmin: true, project})
        await this.projectMembershipRepository.save(membership);
        return project
    }

    public async delete(id: string) {
        await this.projectRepository.delete(id);
    }

    public async getAll(): Promise<Project[]> {
        return this.projectRepository.find();
    }

    public async getById(id: string): Promise<Project> {
        return this.projectRepository.findOneOrFail(id);
    }

    public async getProjectMembers(id: string): Promise<User[]> {
        return getRepository(User).createQueryBuilder()
            .leftJoin("User.projects", "ProjectMembership")
            .where("ProjectMembership.projectId = :id",{id})
            .getMany();
    }

    public async getProjectAdmins(id: string): Promise<User[]> {
        return getRepository(User).createQueryBuilder()
            .leftJoin("User.projects", "ProjectMembership")
            .where("ProjectMembership.projectId = :id",{id})
            .andWhere("ProjectMembership.isAdmin = TRUE")
            .getMany();
    }

    public async addProjectAdmin(projectId: string, userId: string): Promise<void> {
        await this.projectMembershipRepository.createQueryBuilder()
            .update()
            .set({isAdmin: true})
            .where("project = :projectId", {projectId})
            .andWhere("member = :userId", {userId})
            .execute();
    }

    public async addProjectMember(projectId: string, memberId: string): Promise<void> {
        console.log(projectId + " "+ memberId)
        await this.projectRepository.createQueryBuilder()
            .insert()
            .into(ProjectMembership)
            .values({memberId, projectId})
            .execute();
    }

    public async removeProjectAdmin(projectId: string, userId: string): Promise<void> {
        await this.projectMembershipRepository.createQueryBuilder()
            .update()
            .set({isAdmin: false})
            .where("project = :projectId", {projectId})
            .andWhere("member = :userId", {userId})
            .execute();
    }

    public async removeProjectMember(projectId: string, userId: string): Promise<void> {
        await this.projectMembershipRepository.createQueryBuilder()
            .delete()
            .where("project = :projectId", {projectId})
            .andWhere("member = :userId", {userId})
            .execute();
    }

    public async getTickets(projectId: string): Promise<Ticket[]> {
        return (await this.projectRepository.findOneOrFail(projectId, {relations: ["tickets"]})).tickets;
    }

    public async addTicket(projectId: string, props: TicketProps, userId: string) {
        let ticket = getRepository(Ticket).create({...props, creatorId: userId, assigneeId: userId, projectId: projectId});
        ticket = await getRepository(Ticket).save(ticket);
        return ticket;
    }
}
