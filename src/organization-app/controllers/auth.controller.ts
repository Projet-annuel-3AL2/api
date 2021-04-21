import {User} from "../models/user.model";
import {getRepository} from "typeorm";

export class AuthController {

    private static instance: AuthController;

    public static async getInstance(): Promise<AuthController> {
        if (AuthController.instance === undefined) {
            AuthController.instance = new AuthController();
        }
        return AuthController.instance;
    }

    public async register(user: User): Promise<User | null> {
        return await getRepository(User).save(user);
    }
}
