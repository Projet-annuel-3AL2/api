import {User} from "../models/user.model";
import {getRepository, Repository} from "typeorm";
import {validate} from "class-validator";
import {Project, ProjectProps} from "../models/project.model";
import {Ticket} from "../models/ticket.model";

export class ProjectController {

    private static instance: ProjectController;

    private projectRepository: Repository<Project>;

    private constructor() {
        this.projectRepository = getRepository(Project);
    }

    public static async getInstance(): Promise<ProjectController> {
        if (ProjectController.instance === undefined) {
            ProjectController.instance = new ProjectController();
        }
        return ProjectController.instance;
    }

    public async create(props: ProjectProps, admin: User): Promise<Project> {
        const project = this.projectRepository.create({...props});
        if (!Array.isArray(project.admins)) {
            project.admins = [];
        }
        project.admins.push(admin);
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

    public async getProjectMembers(id: string): Promise<User[]> {
        return (await this.projectRepository.findOneOrFail(id, {relations: ["members"]})).members;
    }

    public async getProjectAdmins(id: string): Promise<User[]> {
        return (await this.projectRepository.findOneOrFail(id, {relations: ["admins"]})).admins;
    }

    public async addProjectAdmin(project: Project, user: User): Promise<Project> {
        if (!Array.isArray(project.admins)) {
            project.admins = []
        }
        project.admins.push(user);
        return this.projectRepository.save(project);
    }

    public async addProjectMember(project: Project, user: User): Promise<Project> {
        if (!Array.isArray(project.members)) {
            project.members = []
        }
        project.members.push(user);
        return this.projectRepository.save(project);
    }

    public async removeProjectAdmin(project: Project, userId: string) {
        if (!Array.isArray(project.admins)) {
            project.admins = []
        }
        project.admins = project.admins.filter((u) => u.id !== userId);
        return this.projectRepository.save(project);
    }

    public async removeProjectMember(project: Project, userId: string) {
        if (!Array.isArray(project.members)) {
            project.members = []
        }
        project.members = project.members.filter((u) => u.id !== userId);
        return this.projectRepository.save(project);
    }

    public async getTickets(projectId: string): Promise<Ticket[]> {
        return (await this.projectRepository.findOneOrFail(projectId, {relations: ["tickets"]})).tickets;
    }
}
