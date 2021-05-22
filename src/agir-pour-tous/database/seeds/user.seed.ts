import {Factory, Seeder} from "typeorm-seeding";
import {Connection} from "typeorm";
import {User} from "../../models/user.model";

export class CreateUser implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        await factory(User)({
            username: process.env.SUPERADMIN_USERNAME,
            email: process.env.SUPERADMIN_EMAIL,
            password: process.env.SUPERADMIN_PASSWD
        });
        await factory(User)({}).createMany(10);
    }
}
