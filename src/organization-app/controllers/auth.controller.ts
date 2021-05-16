import {User, UserProps} from "../models/user.model";
import {getRepository, Repository} from "typeorm";
import {validate} from "class-validator";
import {hash} from "bcrypt";

export class AuthController {

    private static instance: AuthController;

    private userRepository: Repository<User>;

    private constructor() {
        this.userRepository = getRepository(User);
    }

    public static async getInstance(): Promise<AuthController> {
        if (AuthController.instance === undefined) {
            AuthController.instance = new AuthController();
        }
        return AuthController.instance;
    }

    public async forgotPassword(username: string){
        const token = require('crypto').randomBytes(30, function(err, buffer) {
            buffer.toString('hex');
        });
        await this.userRepository.createQueryBuilder()
            .update()
            .set({ resetToken: token})
            .set({ resetTokenExpiration: new Date(Date.now() + 600000)})
            .where('username = :username', {username})
            .execute();
    }

    public async resetPassword(resetToken: string, newPassword: string){
        const encryptedPass = await hash(newPassword, 8);
        await this.userRepository.createQueryBuilder()
            .update()
            .set({ password: encryptedPass})
            .where('resetToken = :resetToken', {resetToken})
            .where('resetTokenExpiration < NOW()')
            .execute();
    }
}
