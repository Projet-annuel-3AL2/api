import {User, UserProps} from "../models/user.model";
import {getRepository, Repository} from "typeorm";
import {validate} from "class-validator";
import {sendMail} from "../../organization-app/config/mail.config";
import {hash} from "bcrypt";

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

    public async forgotPassword(username: string) {
        const token = require('crypto').randomBytes(10).toString('hex');
        const user: User = (await this.userRepository.createQueryBuilder()
            .update()
            .set({resetToken: token,resetTokenExpiration: new Date(Date.now() + 600000)})
            .where('username = :username', {username})
            .returning("*")
            .execute()).raw[0];
        if (user === undefined) {
            throw new Error();
        }
        sendMail({
            to: user.mail,
            from: `"Agir pour tous" <${process.env.MAILER_USER}>`,
            subject: "Récupération du mot de passe",
            text: `Afin de réinitialiser votre mot de passe veuillez cliquer sur le lien suivant : ${process.env.FRONT_BASE_URL}/reset-password/${token} celui-ci expire dans 10 minutes`
        });
    }

    public async resetPassword(resetToken: string, password: string) {
        const encryptedPass = await hash(password, 8);
        await this.userRepository.createQueryBuilder()
            .update()
            .set({password: encryptedPass, resetTokenExpiration: null, resetToken: null})
            .where('resetToken = :resetToken', {resetToken})
            .andWhere('resetTokenExpiration > NOW()')
            .execute();
    }
}
