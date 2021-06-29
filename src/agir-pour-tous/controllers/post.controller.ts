import {getRepository, Repository} from "typeorm";
import {Post, PostProps} from "../models/post.model";
import {User} from "../models/user.model";
import {validate} from "class-validator";
import {Organisation} from "../models/organisation.model";

export class PostController {

    private static instance: PostController;

    private postRepository: Repository<Post>;

    private constructor() {
        this.postRepository = getRepository(Post);
    }

    public static async getInstance(): Promise<PostController> {
        if (PostController.instance === undefined) {
            PostController.instance = new PostController();
        }
        return PostController.instance;
    }

    public async create(user: User, props: PostProps): Promise<Post> {
        const post = this.postRepository.create({...props, creator: user});
        const err = await validate(post);
        if (err.length > 0) {
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

    public async getLikes(postId: string): Promise<User[]> {
        return await getRepository(User).createQueryBuilder()
            .leftJoin("User.likedPosts", "Post")
            .where("Post.id=:postId", {postId})
            .getMany();
    }

    public async isLiked(postId: string, userId: string): Promise<boolean> {
        return await this.postRepository.createQueryBuilder()
            .leftJoin("Post.likes", "User")
            .where("Post.id=:postId", {postId})
            .andWhere("User.id=:userId", {userId})
            .getOne() !== undefined;
    }

    public async likePost(postId, userId: string) {
        await this.postRepository.createQueryBuilder()
            .relation("likes")
            .of(postId)
            .add(userId);
    }

    public async dislikePost(postId: string, userId: string) {
        await this.postRepository.createQueryBuilder()
            .relation("likes")
            .of(postId)
            .remove(userId);
    }

    public async getTimeline(userId: string, offset: number, limit: number): Promise<Post[]> {
        console.log(await this.getOwnPosts(userId))
        return [].concat(await this.getOwnPosts(userId))
            .concat(await this.getFriendOnePosts(userId))
            .concat(await this.getFriendTwoPosts(userId))
            .sort((a: Post, b: Post) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    private getOwnPosts(userId: string):Promise<Post[]>{
        return this.postRepository
            .createQueryBuilder()
            .leftJoinAndSelect("Post.creator","User")
            .where("User.id=:userId",{userId})
            .getMany();
    }

    private getFriendOnePosts(userId: string): Promise<Post[]>{
        return this.postRepository
            .createQueryBuilder()
            .leftJoinAndSelect("Post.creator","User")
            .leftJoin("User.friendsOne","FriendOne")
            .leftJoin("FriendOne.friendTwo","FriendTwo")
            .where("FriendTwo.id=:userId",{userId})
            .getMany();
    }

    private getFriendTwoPosts(userId: string): Promise<Post[]>{
        return this.postRepository
            .createQueryBuilder()
            .leftJoinAndSelect("Post.creator","User")
            .leftJoin("User.friendsTwo","FriendTwo")
            .leftJoin("FriendTwo.friendOne","FriendOne")
            .where("FriendOne.id=:userId",{userId})
            .getMany();
    }

    async getAllWithOrgaId(orga: Organisation): Promise<Post[]> {
        return await this.postRepository.find({
            where:{
                organisation: orga
            }
        })
    }
}
