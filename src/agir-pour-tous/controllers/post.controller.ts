import {getRepository, Repository } from "typeorm";
import { Post } from "../models/post.model";


export class PostController {
    private static instance: PostController;
    private postRepository: Repository<Post>;

    constructor() {
        this.postRepository = getRepository(Post);
    }

    public static async getInstance(): Promise<PostController> {
        if (PostController.instance === undefined){
            PostController.instance = new PostController();
        }
        return PostController.instance;
    }

}
