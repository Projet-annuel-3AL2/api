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

    public async getComments(postId: string): Promise<Comment[]> {
        return getRepository(Comment)
            .createQueryBuilder()
            .leftJoinAndSelect("Comment.creator", "User")
            .leftJoinAndSelect("User.profilePicture", "ProfPic")
            .leftJoin("Comment.post", "Post")
            .where("Post.id=:postId", {postId})
            .orderBy("Comment.createdAt", "DESC")
            .getMany();
    }

    public async getSharedPost(postId: string): Promise<Post> {
        return this.postRepository
            .createQueryBuilder()
            .leftJoinAndSelect("Post.creator", "Creator")
            .leftJoinAndSelect("Creator.certification", "Certification")
            .leftJoinAndSelect("Creator.profilePicture", "ProfPic")
            .leftJoin("Post.sharedPosts", "Shares")
            .where("Shares.id=:postId", {postId})
            .getOne();
    }

    public async addComment(postId: string, creator: User, commentProps: CommentProps) {
        const post = await this.getById(postId);
        let comment = getRepository(Comment).create({...commentProps, creator, post});
        return await getRepository(Comment).save(comment);
    }

    async getAllReport(): Promise<Report[]> {
        return await getRepository(Report).createQueryBuilder()
            .leftJoinAndSelect("Report.reportedPost", "ReportedPost")
            .leftJoinAndSelect("ReportedPost.creator", "Creator")
            .leftJoinAndSelect("Report.userReporter", "UserReporter")
            .where("Report.reportedPost is not null")
            .getMany()
    }

    async countReport(postId: string) {
        return await getRepository(Report).createQueryBuilder()
            .leftJoinAndSelect("Report.reportedPost", "ReportedPost")
            .where("ReportedPost.id =:postId", {postId})
            .getCount();
    }


    public async getTimeline(userId: string, offset: number, limit: number): Promise<Post[]> {
        return this.postRepository.createQueryBuilder()
            .leftJoinAndSelect("Post.creator", "User")
            .leftJoinAndSelect("Post.sharedEvent", "Event")
            .leftJoinAndSelect("User.certification", "Cert")
            .leftJoinAndSelect("User.profilePicture", "ProfilePicture")
            .leftJoin("User.friendsOne", "FriendshipOne")
            .leftJoin("FriendshipOne.friendTwo", "FriendTwo")
            .leftJoin("User.friendsTwo", "FriendshipTwo")
            .leftJoin("FriendshipTwo.friendOne", "FriendOne")
            .leftJoinAndSelect("Post.organisation", "Organisation")
            .leftJoinAndSelect("Organisation.profilePicture", "OrgaProfilePicture")
            .leftJoin("Organisation.followers", "Follower")
            .leftJoin("Organisation.members", "OrganisationMembership")
            .leftJoin("OrganisationMembership.user", "Member")
            .where("User.id=:userId", {userId})
            .orWhere("FriendTwo.id=:userId", {userId})
            .orWhere("FriendOne.id=:userId", {userId})
            .orWhere("Follower.id=:userId", {userId})
            .orWhere("Member.id=:userId", {userId})
            .limit(limit)
            .offset(offset)
            .orderBy("Post.createdAt","DESC")
            .getMany();
    }
}
