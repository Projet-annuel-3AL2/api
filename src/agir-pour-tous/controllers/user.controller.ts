import {User, UserProps} from "../models/user.model";
import {getRepository, Repository} from "typeorm";

export class UserController {

    private static instance: UserController;

    private userRepository: Repository<User>;

    private constructor() {
        this.userRepository = getRepository(User);
    }

    public static getInstance(): UserController {
        if (UserController.instance === undefined) {
            UserController.instance = new UserController();
        }
        return UserController.instance;
    }

    public async getById(id: string): Promise<User>{
        return await this.userRepository.findOneOrFail(id);
    }

    public async getAll(): Promise<User[]>{
        return await this.userRepository.find();
    }

    public async delete(id: string): Promise<void>{
        await this.userRepository.delete(id);
    }

    public async update(id: string, props: UserProps): Promise<User>{
        await this.userRepository.update(id, props);
        return this.getById(id);
    }

}
