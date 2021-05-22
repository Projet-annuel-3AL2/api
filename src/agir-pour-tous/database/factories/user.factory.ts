import * as Faker from "faker";
import {define} from "typeorm-seeding";
import {User, UserProps, UserType} from "../../models/user.model";

define(User, (faker: typeof Faker, context: UserProps) => {
    const user = new User();
    const randomRole = faker.random.objectElement<UserType>(UserType);
    user.username = context.username || faker.random.alphaNumeric(20);
    user.firstname = context.firstname || faker.name.firstName();
    user.lastname = context.lastname || faker.name.lastName();
    user.password = context.password || faker.random.word();
    user.mail = context.mail || faker.internet.email(user.firstname, user.lastname);
    user.userType = context.userType || randomRole;
    return user;
});
