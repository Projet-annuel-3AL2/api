import {getRepository, Repository} from "typeorm";
import {Post, PostProps} from "../models/post.model";
import {User} from "../models/user.model";
import {validate} from "class-validator";
import {Organisation, OrganisationProps} from "../models/organisation.model";
import {OrganisationMembership} from "../models/organisation_membership.model";

export class OrganisationController {

    private static instance: OrganisationController;

    private organisationRepository: Repository<Organisation>;

    private constructor() {
        this.organisationRepository = getRepository(Organisation);
    }

    public static getInstance(): OrganisationController {
        if (OrganisationController.instance === undefined) {
            OrganisationController.instance = new OrganisationController();
        }
        return OrganisationController.instance;
    }

    public async create(user: User, props: OrganisationProps): Promise<Organisation> {
        const organisation = this.organisationRepository.create({...props});
        const creatorMembership = getRepository(OrganisationMembership).create({organisation, user});
        organisation.members = [creatorMembership];
        const err = await validate(organisation);
        if (err.length > 0) {
            throw err;
        }
        return this.organisationRepository.save(organisation);
    }

    public async getByName(organisationName: string): Promise<Organisation> {
        return await this.organisationRepository.findOneOrFail(organisationName);
    }

    public async getAll(): Promise<Organisation[]> {
        return await this.organisationRepository.find();
    }

    public async getSuggestionOrganisation() {
        return await this.organisationRepository.find({
            order: {
                createdAt: "DESC"
            },
            take: 3
        })
    }
    public async delete(organisationName: string): Promise<void> {
        await this.organisationRepository.softDelete(organisationName);
    }

    public async update(organisationName: string, props: OrganisationProps): Promise<Organisation> {
        await this.organisationRepository.update(organisationName, props);
        return this.getByName(organisationName);
    }

    public async getPosts(organisationName: string): Promise<Post[]> {
        return await getRepository(Post)
            .createQueryBuilder()
            .leftJoin("Post.organisation", "Organisation")
            .where("Organisation.name=:groupName", {organisationName})
            .getMany();
    }

    public async addPost(organisation: Organisation, creator: User, props: PostProps): Promise<Post> {
        const post = getRepository(Post).create({...props, creator, organisation});
        const err = await validate(post);
        if (err.length > 0) {
            throw err;
        }
        return getRepository(Post).save(post);
    }
}
