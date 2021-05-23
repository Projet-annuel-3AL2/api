import * as Faker from "faker";
import {define} from "typeorm-seeding";
import {Post, PostProps} from "../../models/post.model";

define(Post, (faker: typeof Faker, context: PostProps): Post => {
    const post = new Post();
    post.text = context.text || faker.lorem.word(250);
    return post;
});
