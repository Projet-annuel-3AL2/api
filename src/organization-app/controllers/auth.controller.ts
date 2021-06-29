import {User} from "../models/user.model";
import {getRepository, Repository} from "typeorm";
import {hash} from "bcrypt";
import {sendMail} from "../config/mail.config";

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

    public async forgotPassword(username: string) {
        const token = require('crypto').randomBytes(5).toString('hex');
        const user: User = (await this.userRepository.createQueryBuilder()
            .update()
            .set({resetToken: token})
            .set({resetTokenExpiration: new Date(Date.now() + 600000)})
            .where('username = :username', {username})
            .returning("*")
            .execute()).raw[0];
        if (user === undefined) {
            throw new Error();
        }
        sendMail({
            to: user.mail,
            from: `"Organisation app" <${process.env.MAILER_USER}>`,
            subject: "Récupération du mot de passe",
            text: `Veuillez saisir le code suivant: ${token} celui-ci expire dans 10 minutes`
        });
    }

    public async resetPassword(resetToken: string, password: string) {
        const encryptedPass = await hash(password, 8);
        await this.userRepository.createQueryBuilder()
            .update()
            .set({password: encryptedPass, resetTokenExpiration: null, resetToken: null})
            .where('resetToken = :resetToken', {resetToken})
            .where('resetTokenExpiration > NOW()')
            .execute();
    }
}
