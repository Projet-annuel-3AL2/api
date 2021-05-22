import {getRepository, Repository} from "typeorm";
import {Post, PostProps} from "../models/post.model";
import {User} from "../models/user.model";
import {validate} from "class-validator";

export class PostController {

    private static instance: PostController;

    private postRepository: Repository<Post>;

    private constructor() {
        this.postRepository = getRepository(Post);
    }

    public static getInstance(): PostController {
        if (PostController.instance === undefined) {
            PostController.instance = new PostController();
        }
        return PostController.instance;
    }

    public async create(user: User, props: PostProps): Promise<Post> {
        const post = this.postRepository.create({...props, creator: user});
        const err = await validate(post);
        if(err.length > 0) {
            throw err;
        }
        return this.postRepository.save(post);
    }

    public async getById(postId: string): Promise<Post> {
        return await this.postRepository.findOneOrFail(postId);
    }

    public async getAll(): Promise<Post[]> {
        return await this.postRepository.find();
    }

    public async delete(postId: string): Promise<void> {
        await this.postRepository.softDelete(postId);
    }

    public async update(postId: string, props: PostProps): Promise<Post> {
        await this.postRepository.update(postId, props);
        return this.getById(postId);
    }

    public async getLikes(postId: string): Promise<Post[]> {
        return await getRepository(Post)
            .createQueryBuilder()
            .leftJoin("Post.likes", "User")
            .where("Post.postId=:postId", {postId})
            .getMany();
    }
}
