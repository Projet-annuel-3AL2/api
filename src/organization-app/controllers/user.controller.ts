import {User} from "../models/user.model";
import {getRepository} from "typeorm";

export class UserController {

    private static instance: UserController;

    public static async getInstance(): Promise<UserController> {
        if (UserController.instance === undefined) {
            UserController.instance = new UserController();
        }
        return UserController.instance;
    }

    public async getAll(): Promise<User[]> {
        return (await getRepository(User)).find();
    }

    public async getById(id: string): Promise<User> {
        return (await getRepository(User)).findOne(id);
    }
}
