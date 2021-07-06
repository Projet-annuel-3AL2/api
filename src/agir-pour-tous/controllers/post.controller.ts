import {getRepository, Repository} from "typeorm";
import {Post, PostProps} from "../models/post.model";
import {User} from "../models/user.model";
import {validate} from "class-validator";
import {Report, ReportProps} from "../models/report.model";
import {Comment, CommentProps} from "../models/comment.model";

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
        return [].concat(await this.getOwnPosts(userId))
            .concat(await this.getFriendOnePosts(userId))
            .concat(await this.getFriendTwoPosts(userId))
            .sort((a: Post, b: Post) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    public async reportPost(userReporter: User, reportedPost: Post, props: ReportProps): Promise<Report> {
        const report = getRepository(Report).create({...props, userReporter, reportedPost});
        return await getRepository(Report).save(report);
    }

    public async getReports(postId: string): Promise<Report[]> {
        return await getRepository(Report).createQueryBuilder()
            .leftJoin("Report.reportedPost", "ReportedPost")
            .where("ReportedPost.id=:postId", {postId})
            .getMany();
    }

    public async isPostOwner(postId: string, userId: string): Promise<Boolean> {
        return (await this.postRepository
            .createQueryBuilder()
            .leftJoin("Post.creator", "User")
            .where("User.id=:userId", {userId})
            .andWhere("Post.id=:postId", {postId})
            .getOne() !== undefined);
    }

    private getOwnPosts(userId: string): Promise<Post[]> {
        return this.postRepository
            .createQueryBuilder()
            .leftJoinAndSelect("Post.creator", "User")
            .where("User.id=:userId", {userId})
            .getMany();
    }

    private getFriendOnePosts(userId: string): Promise<Post[]> {
        return this.postRepository
            .createQueryBuilder()
            .leftJoinAndSelect("Post.creator", "User")
            .leftJoin("User.friendsOne", "FriendOne")
            .leftJoin("FriendOne.friendTwo", "FriendTwo")
            .where("FriendTwo.id=:userId", {userId})
            .getMany();
    }

    private getFriendTwoPosts(userId: string): Promise<Post[]> {
        return this.postRepository
            .createQueryBuilder()
            .leftJoinAndSelect("Post.creator", "User")
            .leftJoin("User.friendsTwo", "FriendTwo")
            .leftJoin("FriendTwo.friendOne", "FriendOne")
            .where("FriendOne.id=:userId", {userId})
            .getMany();
    }

    public async getComments(postId: string): Promise<Comment[]> {
        return getRepository(Comment)
            .createQueryBuilder()
            .leftJoinAndSelect("Comment.creator","User")
            .leftJoin("Comment.post", "Post")
            .where("Post.id=:postId", {postId})
            .getMany();
    }

    public async addComment(postId: string, creator: User, commentProps: CommentProps) {
        const post = await this.getById(postId);
        let comment = getRepository(Comment).create({...commentProps, creator, post});
        return await getRepository(Comment).save(comment);
    }
}
