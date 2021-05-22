import {Factory, Seeder} from "typeorm-seeding";
import {Connection} from "typeorm";
import {Post} from "../../models/post.model";
import {User} from "../../models/user.model";
import {Event} from "../../models/event.model";
import {Comment} from "../../models/comment.model";
import {Category} from "../../models/category.model";

export class CreatePost implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        const postCreator = await factory(User)({}).create();
        const usersLikes = await factory(User)({}).makeMany(5);
        const event = await factory(Event)({})
            .map(async event => {
                event.category = await factory(Category)({}).create();
                return event;
            })
            .create();
        await factory(Post)({})
            .map(async (post: Post) => {
                post.creator = postCreator;
                post.likes = usersLikes;
                post.comments = await factory(Comment)({})
                    .map(async (comment: Comment) => {
                        comment.creator = await factory(User)({}).create();
                        return comment;
                    })
                    .createMany(5);
                return post;
            }).createMany(5);
        const postToShare = await factory(Post)({})
            .map(async (post: Post) => {
                post.creator = postCreator;
                post.likes = usersLikes;
                post.comments = await factory(Comment)({})
                    .map(async (comment: Comment) => {
                        comment.creator = await factory(User)({}).create();
                        return comment;
                    })
                    .createMany(5);
                post.sharedEvent = event;
                return post;
            })
            .create();
        await factory(Post)({})
            .map(async (post: Post) => {
                post.creator = postCreator;
                post.likes = usersLikes;
                post.comments = await factory(Comment)({})
                    .map(async (comment: Comment) => {
                        comment.creator = await factory(User)({}).create();
                        return comment;
                    })
                    .createMany(5);
                post.sharesPost = postToShare;
                return post;
            }).createMany(3);
    }
}
