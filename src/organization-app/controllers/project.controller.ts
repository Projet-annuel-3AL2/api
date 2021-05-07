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
        const project = this.projectRepository.create({...props});
        if (!Array.isArray(project.members)) {
            project.members = [];
        }
        const admin = this.projectMembershipRepository.create({member: user, isAdmin: true, project})
        project.members.push(admin);
        const err = await validate(project, {validationError: {target: false}});
        if (err.length > 0) {
            throw err;
        }
        return this.projectRepository.save(project);
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

    public async getProjectMembers(id: string): Promise<ProjectMembership[]> {
        return (await this.projectRepository.findOneOrFail(id, {relations: ["members"]})).members;
    }

    public async getProjectAdmins(id: string): Promise<ProjectMembership[]> {
        return (await this.projectRepository.findOneOrFail(id, {relations: ["admins"]})).members.filter(member => member.isAdmin);
    }

    public async addProjectAdmin(projectId: string, userId: string): Promise<void> {
        await this.projectMembershipRepository.createQueryBuilder()
            .update()
            .set({isAdmin: true})
            .where("project = :projectId", {projectId})
            .andWhere("member = :userId", {userId})
            .execute();
    }

    public async addProjectMember(projectId: string, userId: string): Promise<void> {
        await this.projectRepository.createQueryBuilder()
            .relation(Project, "members")
            .of(projectId)
            .add(userId);
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

    public async addTicket(projectId: any, props: TicketProps) {
        const ticket = getRepository(Ticket).create({...props});
        await this.projectRepository.createQueryBuilder()
            .relation(Ticket, "tickets")
            .of(projectId)
            .add(ticket);
        return ticket;
    }
}
