import {User} from "../models/user.model";
import {getRepository, Repository} from "typeorm";
import {validate} from "class-validator";
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
        return (await this.userRepository.findOneOrFail(id, {relations: ["projectsMember"]})).projectsMember;
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
}
