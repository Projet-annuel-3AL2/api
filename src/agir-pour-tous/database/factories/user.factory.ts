import * as Faker from "faker"
import { define } from "typeorm-seeding"
import {User, UserType} from "../../models/user.model";

define(User, (faker: typeof Faker) => {
    const user = new User()
    const randomRole: UserType = faker.random.arrayElement(Object.values(UserType)) as UserType;
    user.username = faker.lorem.word(20);
    user.firstname = faker.name.firstName();
    user.lastname = faker.name.lastName();
    user.password = faker.random.word();
    user.mail = faker.random.word();
    user.userType = randomRole;
    return user
});
