import {getRepository, Repository} from "typeorm";
import {Comment} from "../models/comment.model";
import {User} from "../models/user.model";
import {Report, ReportProps} from "../models/report.model";

export class CommentController {
    private static instance: CommentController;

    private commentRepository: Repository<Comment>;

    private constructor() {
        this.commentRepository = getRepository(Comment);
    }

    public static getInstance(): CommentController {
        if (CommentController.instance === undefined) {
            CommentController.instance = new CommentController();
        }
        return CommentController.instance;
    }

    public async getById(commentId: string): Promise<Comment> {
        return await this.commentRepository.findOneOrFail(commentId);
    }

    public async delete(commentId: string): Promise<void> {
        await this.commentRepository.delete(commentId);
    }

    public async getOwner(commentId: string): Promise<User> {
        return await getRepository(User).createQueryBuilder()
            .leftJoin("User.comments", "Comment")
            .where("Comment.id=:commentId", {commentId})
            .getOne();
    }

    public async reportComment(userReporter: User, reportedComment: Comment, props: ReportProps): Promise<Report> {
        const report = getRepository(Report).create({...props, userReporter, reportedComment});
        return await getRepository(Report).save(report);
    }

}
