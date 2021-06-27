import {User, UserProps} from "../models/user.model";
import {getRepository, Repository} from "typeorm";
import {validate} from "class-validator";

export class AuthController {

    private static instance: AuthController;

    private userRepository: Repository<User>;

    private constructor() {
        this.userRepository = getRepository(User);
    }

    public static getInstance(): AuthController {
        if (AuthController.instance === undefined) {
            AuthController.instance = new AuthController();
        }
        return AuthController.instance;
    }

    public async register(props: UserProps): Promise<User> {
        const user = this.userRepository.create({...props});
        const err = await validate(user);
        if (err.length > 0) {
            throw err;
        }
        return await this.userRepository.save(user);
    }
}
