import {User} from "../models/user.model";
import {getRepository, Repository} from "typeorm";
import {validate} from "class-validator";
import {Project, ProjectProps} from "../models/project.model";

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
}
