import {User} from "../models/user.model";
import {getRepository, Repository} from "typeorm";
import {SearchResult} from "../models/search.model";
import {Event} from "../models/event.model";
import {Post} from "../models/post.model";
import {Organisation} from "../models/organisation.model";

export class SearchController {

    private static instance: SearchController;

    private userRepository: Repository<User>;
    private eventRepository: Repository<Event>;
    private organisationRepository: Repository<Organisation>;
    private postRepository: Repository<Post>;

    private constructor() {
        this.userRepository = getRepository(User);
        this.eventRepository = getRepository(Event);
        this.organisationRepository = getRepository(Organisation);
        this.postRepository = getRepository(Post);
    }

    public static getInstance(): SearchController {
        if (SearchController.instance === undefined) {
            SearchController.instance = new SearchController();
        }
        return SearchController.instance;
    }

    public async search(data: string): Promise<SearchResult>{
        data = '%'+data+'%';
        return {
            events: await this.getEvents(data),
            organisations: await this.getOrganisations(data),
            posts: await this.getPosts(data),
            users: await this.getUsers(data)
        };
    }

    private async getUsers(data: string): Promise<User[]> {
        return await this.userRepository.createQueryBuilder()
            .where("User.username like :data",{data})
            .orWhere("User.firstname like :data",{data})
            .orWhere("User.lastname like :data",{data})
            .orWhere("User.bio like :data",{data})
            .getMany();
    }

    private async getEvents(data: string): Promise<Event[]> {
        return await this.eventRepository.createQueryBuilder()
            .where("Event.name like :data",{data})
            .orWhere("Event.description like :data",{data})
            .getMany();
    }

    private async getOrganisations(data: string): Promise<Organisation[]> {
        return await this.organisationRepository.createQueryBuilder()
            .where("Organisation.name like :data",{data})
            .getMany();
    }

    private async getPosts(data: string): Promise<Post[]> {
        return await this.postRepository.createQueryBuilder()
            .where("Post.text like :data",{data})
            .getMany();
    }
}
