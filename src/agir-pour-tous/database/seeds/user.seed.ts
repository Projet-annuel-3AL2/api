import {Factory, Seeder} from "typeorm-seeding";
import {Connection} from "typeorm";
import {User, UserType} from "../../models/user.model";

export class CreateUser implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        await factory(User)({
            username: process.env.SUPERADMIN_USERNAME,
            email: process.env.SUPERADMIN_EMAIL,
            password: process.env.SUPERADMIN_PASSWD,
            userType: UserType.SUPER_ADMIN
        }).create();
        await factory(User)({}).createMany(10);
    }
}
