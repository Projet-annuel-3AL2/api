import {getRepository, Repository} from "typeorm";
import {Post, PostProps} from "../models/post.model";

export class PostController {

    private static instance: PostController;

    private PostRepository: Repository<Post>;

    private constructor() {
        this.PostRepository = getRepository(Post);
    }

    public static getInstance(): PostController {
        if (PostController.instance === undefined) {
            PostController.instance = new PostController();
        }
        return PostController.instance;
    }

    public async getById(postId: string): Promise<Post> {
        return await this.PostRepository.findOneOrFail(postId);
    }

    public async getAll(): Promise<Post[]> {
        return await this.PostRepository.find();
    }

    public async delete(postId: string): Promise<void> {
        await this.PostRepository.softDelete(postId);
    }

    public async update(postId: string, props: PostProps): Promise<Post> {
        await this.PostRepository.update(postId, props);
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
