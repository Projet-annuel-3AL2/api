import * as Faker from "faker"
import { define } from "typeorm-seeding"
import {User, UserProps, UserType} from "../../models/user.model";

define(User, (faker: typeof Faker, props: UserProps): User => {
    const user = new User()
    const randomRole: UserType = faker.random.arrayElement(Object.values(UserType)) as UserType;
    user.username = props.username || faker.lorem.word(20);
    user.firstname = props.firstname ||  faker.name.firstName();
    user.lastname = props.lastname ||  faker.name.lastName();
    user.password = props.password ||  faker.random.word();
    user.mail = props.mail ||  faker.random.word();
    user.userType = props.userType ||  randomRole;
    return user;
});
