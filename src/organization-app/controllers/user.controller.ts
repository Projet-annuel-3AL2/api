import {User, UserProps} from "../models/user.model";
import {getRepository, Repository} from "typeorm";
import {validate} from "class-validator";
import {ProjectMembership} from "../models/project-membership.model";
import {hash} from "bcrypt";
import {Project} from "../models/project.model";

export class UserController {

    private static instance: UserController;

    private userRepository: Repository<User>;

    private constructor() {
        this.userRepository = getRepository(User);
    }

    public static async getInstance(): Promise<UserController> {
        if (UserController.instance === undefined) {
            UserController.instance = new UserController();
        }
        return UserController.instance;
    }

    public async getAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    public async getById(id: string): Promise<User> {
        return this.userRepository.findOneOrFail(id);
    }

    public async getProjects(id: string): Promise<Project[]> {
        return getRepository(Project).createQueryBuilder()
            .leftJoin("Project.members", "ProjectMembership")
            .where("ProjectMembership.memberId = :id",{id})
            .getMany();
    }
    public async delete(id: string) {
        await this.userRepository.delete(id);
    }

    public async update(id: string, props: UserProps): Promise<User> {
        await this.userRepository.update(id, {...props});
        return await this.getById(id);
    }

    public async setAdmin(id: string, admin: boolean): Promise<User> {
        const user = await this.userRepository.findOneOrFail(id);
        user.isAdmin = admin;
        const err = await validate(user, {validationError: {target: false}});
        if (err.length > 0) {
            throw err;
        }
        return this.userRepository.save(user);
    }

    public async create(props: UserProps): Promise<User> {
        const password = require('crypto').randomBytes(20).toString("hex");
        const encryptedPass = await hash(password, 8);
        const user = this.userRepository.create({...props, password: encryptedPass});
        const err = await validate(user, {validationError: {target: false}});
        if (err.length > 0) {
            throw err;
        }
        return this.userRepository.save(user);
    }
}
