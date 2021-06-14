import * as Faker from "faker";
import {define} from "typeorm-seeding";
import {Category, CategoryProps} from "../../models/category.model";

define(Category, (faker: typeof Faker, context: CategoryProps) => {
    const category = new Category();
    category.name = context.name || faker.lorem.word(100);
    return category;
});
