import {getRepository, Repository} from "typeorm";
import {Post, PostProps} from "../models/post.model";
import {User} from "../models/user.model";
import {validate} from "class-validator";
import {Organisation, OrganisationProps} from "../models/organisation.model";
import {OrganisationMembership} from "../models/organisation_membership.model";
import {Report, ReportProps} from "../models/report.model";
import {
    OrganisationCreationRequest,
    OrganisationCreationRequestProps
} from "../models/organisation_creation_request.model";

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

    private async create(user: User, name: string): Promise<Organisation> {
        const organisation = this.organisationRepository.create({name});
        const creatorMembership = getRepository(OrganisationMembership).create({
            organisation,
            user,
            isOwner: true,
            isAdmin: true
        });
        organisation.members = [creatorMembership];
        const err = await validate(organisation);
        if (err.length > 0) {
            throw err;
        }
        return this.organisationRepository.save(organisation);
    }

    public async getById(id: string): Promise<Organisation> {
        return await this.organisationRepository.findOneOrFail(id);
    }

    public async getAll(): Promise<Organisation[]> {
        return await this.organisationRepository.find();
    }

    public async getSuggestionOrganisation(): Promise<Organisation[]> {
        return await this.organisationRepository.find({
            order: {
                createdAt: "DESC"
            },
            take: 3
        })
    }

    public async delete(id: string): Promise<void> {
        await this.organisationRepository.softDelete(id);
    }

    public async update(id: string, props: OrganisationProps): Promise<Organisation> {
        await this.organisationRepository.update(id, props);
        return this.getById(id);
    }

    public async getPosts(id: string): Promise<Post[]> {
        return await getRepository(Post)
            .createQueryBuilder()
            .leftJoin("Post.organisation", "Organisation")
            .where("Organisation.id=:id", {id})
            .getMany();
    }

    public async getFollowers(id: string): Promise<User[]> {
        return await getRepository(User).createQueryBuilder()
            .leftJoin("User.followedOrganisations", "Organisation")
            .where("Organisation.id=:id", {id})
            .getMany();
    }

    public async addFollower(id: string, userId: string): Promise<void> {
        await this.organisationRepository.createQueryBuilder()
            .relation("followers")
            .of(userId)
            .add(id);
    }

    public async removeFollower(id: string, userId: string): Promise<void> {
        await this.organisationRepository.createQueryBuilder()
            .relation("followers")
            .of(userId)
            .remove(id);
    }

    public async addPost(organisation: Organisation, creator: User, props: PostProps): Promise<Post> {
        const post = getRepository(Post).create({...props, creator, organisation});
        const err = await validate(post);
        if (err.length > 0) {
            throw err;
        }
        return getRepository(Post).save(post);
    }

    public async reportOrganisation(userReporter: User, reportedOrganisation: Organisation, props: ReportProps): Promise<Report> {
        const report = getRepository(Report).create({...props, userReporter, reportedOrganisation});
        return await getRepository(Report).save(report);
    }

    public async getReports(organisationId: string): Promise<Report[]> {
        return await getRepository(Report).createQueryBuilder()
            .leftJoin("Report.reportedOrganisation", "ReportedOrganisation")
            .where("ReportedOrganisation.id=:organisationId", {organisationId})
            .getMany();
    }

    public async getMembers(organisationId: string): Promise<User[]> {
        return await getRepository(User).createQueryBuilder()
            .leftJoin("User.organisations", "OrganisationMembership")
            .leftJoin("OrganisationMembership.organisation", "Organisation")
            .where("Organisation.id=:organisationId", {organisationId})
            .getMany();
    }

    public async removeMember(organisationId: string, userId: string): Promise<void> {
        await getRepository(OrganisationMembership).softRemove(await getRepository(OrganisationMembership).createQueryBuilder()
            .leftJoinAndSelect("OrganisationMembership.organisation", "Organisation")
            .leftJoinAndSelect("OrganisationMembership.user", "User")
            .where("User.id=:userId", {userId})
            .andWhere("Organisation.id=:organisationId", {organisationId})
            .getOne());
    }

    public async isAdmin(organisationId: string, userId: string): Promise<boolean> {
        const memberShip = await getRepository(OrganisationMembership).createQueryBuilder()
            .leftJoin("OrganisationMembership.organisation", "Organisation")
            .leftJoin("OrganisationMembership.user", "User")
            .where("Organisation.id=:organisationId", {organisationId})
            .andWhere("User.id=:userId", {userId})
            .getOne();
        return memberShip != undefined ? memberShip.isAdmin: false;
    }

    public async isOwner(organisationId: string, userId: string): Promise<boolean> {
        const memberShip = await getRepository(OrganisationMembership).createQueryBuilder()
            .leftJoin("OrganisationMembership.organisation", "Organisation")
            .leftJoin("OrganisationMembership.user", "User")
            .where("Organisation.id=:organisationId", {organisationId})
            .andWhere("User.id=:userId", {userId})
            .getOne();
        return memberShip != undefined ? memberShip.isOwner: false;
    }

    public async addAdmin(organisationId: string, userId: string): Promise<void> {
        const membership = await getRepository(OrganisationMembership).createQueryBuilder()
            .leftJoinAndSelect("OrganisationMembership.organisation", "Organisation")
            .leftJoinAndSelect("OrganisationMembership.user", "User")
            .where("Organisation.id=:organisationId", {organisationId})
            .andWhere("User.id=:userId", {userId})
            .getOne();
        membership.isAdmin = true;
        await getRepository(OrganisationMembership).save(membership);
    }

    public async removeAdmin(organisationId: string, userId: string): Promise<void> {
        const membership = await getRepository(OrganisationMembership).createQueryBuilder()
            .leftJoinAndSelect("OrganisationMembership.organisation", "Organisation")
            .leftJoinAndSelect("OrganisationMembership.user", "User")
            .where("Organisation.id=:organisationId", {organisationId})
            .andWhere("User.id=:userId", {userId})
            .getOne();
        membership.isAdmin = false;
        await getRepository(OrganisationMembership).save(membership);
    }

    public async inviteUser(organisationId: string, userId: string): Promise<void> {
        await this.organisationRepository.createQueryBuilder()
            .relation("invitedUsers")
            .of(organisationId)
            .add(userId);
    }

    public async cancelInvitation(organisationId: string, userId: string): Promise<void> {
        await this.organisationRepository.createQueryBuilder()
            .relation("invitedUsers")
            .of(organisationId)
            .remove(userId);
    }

    public async acceptInvitation(organisation: Organisation, user: User): Promise<void> {
        const membership = getRepository(OrganisationMembership).create({
            organisation,
            user,
            isOwner: false,
            isAdmin: false
        });
        await getRepository(OrganisationMembership).save(membership);
        await this.cancelInvitation(organisation.id, user.id);
    }

    public async rejectInvitation(organisationId: string, userId: string): Promise<void> {
        await this.cancelInvitation(organisationId,userId);
    }

    public async requestCreation(user: User, props: OrganisationCreationRequestProps): Promise<OrganisationCreationRequest>{
        const request = getRepository(OrganisationCreationRequest).create({...props,user});
        return getRepository(OrganisationCreationRequest).save(request);
    }

    public async getCreationRequests(): Promise<OrganisationCreationRequest>{
        return undefined;
    }

    public async getCreationRequestById(organisationCreationRequestId: string): Promise<OrganisationCreationRequest>{
        return await getRepository(OrganisationCreationRequest).findOneOrFail(organisationCreationRequestId);
    }

    public async acceptCreationDemand(organisationCreationRequestId: string): Promise<Organisation>{
        const request = await this.getCreationRequestById(organisationCreationRequestId);
        await this.rejectCreationDemand(organisationCreationRequestId);
        return this.create(request.user, request.name);
    }

    public async rejectCreationDemand(organisationCreationRequestId: string): Promise<void> {
        await getRepository(OrganisationCreationRequest).softDelete(organisationCreationRequestId);
    }
}
