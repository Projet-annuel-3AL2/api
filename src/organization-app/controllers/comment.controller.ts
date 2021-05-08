import {getRepository, Repository} from "typeorm";
import {Comment, CommentProps} from "../models/comment.model";

export class CommentController {

    private static instance: CommentController;

    private commentRepository: Repository<Comment>;

    private constructor() {
        this.commentRepository = getRepository(Comment);
    }

    public static async getInstance(): Promise<CommentController> {
        if (CommentController.instance === undefined) {
            CommentController.instance = new CommentController();
        }
        return CommentController.instance;
    }

    public async getAll(): Promise<Comment[]> {
        return this.commentRepository.find();
    }

    public async getById(id: string): Promise<Comment> {
        return this.commentRepository.findOneOrFail(id);
    }

    public async delete(id: string) {
        await this.commentRepository.delete(id);
    }

    public async update(id: string, props: CommentProps): Promise<Comment> {
        await this.commentRepository.update(id, {...props});
        return await this.getById(id);
    }
}
