import * as Faker from "faker";
import {define} from "typeorm-seeding";
import {Comment, CommentProps} from "../../models/comment.model";

define(Comment, (faker: typeof Faker, context: CommentProps) => {
    const comment = new Comment()
    comment.text = context.text || faker.lorem.word(250);
    return comment;
});
