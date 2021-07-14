import {getRepository, Repository} from "typeorm";
import {Media} from "../models/media.model";

export class MediaController {
    private static instance: MediaController;

    private mediaRepository: Repository<Media>;

    private constructor() {
        this.mediaRepository = getRepository(Media);
    }

    public static getInstance(): MediaController {
        if (MediaController.instance === undefined) {
            MediaController.instance = new MediaController();
        }
        return MediaController.instance;
    }

    public async create(file: Express.Multer.File): Promise<Media> {
        const media = this.mediaRepository.create({link:file.filename});
        return await this.mediaRepository.save(media);
    }

    public async getPostMedias(postId: string): Promise<Media[]> {
        return this.mediaRepository.createQueryBuilder()
            .leftJoin("Media.post","Post")
            .where("Post.id=:postId",{postId})
            .getMany();
    }
}
