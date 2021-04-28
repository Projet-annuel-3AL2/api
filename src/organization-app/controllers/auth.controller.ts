import {User, UserProps} from "../models/user.model";
import {getRepository, Repository} from "typeorm";
import {validate} from "class-validator";
import {hash} from "bcrypt";

export class AuthController {

    private static instance: AuthController;

    private userRepository:Repository<User>;

    private constructor(){
        this.userRepository = getRepository(User);
    }

    public static async getInstance(): Promise<AuthController> {
        if (AuthController.instance === undefined) {
            AuthController.instance = new AuthController();
        }
        return AuthController.instance;
    }

    public async register(props: UserProps): Promise<User | null> {
        const encryptedPass = await hash(props.password, 8);
        const user = this.userRepository.create({...props, password: encryptedPass});
        await validate(user, { validationError: { target: false } });
        return await this.userRepository.save(user);
    }
}
