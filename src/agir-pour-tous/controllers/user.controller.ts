import {User, UserProps} from "../models/user.model";
import {getRepository, Repository} from "typeorm";
import {Post} from "../models/post.model";
import {Conversation} from "../models/conversation.model";
import {Group} from "../models/group.model";
import {GroupMembership} from "../models/group_membership.model";
import {Event} from "../models/event.model";
import {Report, ReportProps} from "../models/report.model";

export class UserController {

    private static instance: UserController;

    private userRepository: Repository<User>;
    private conversationRepository: Repository<Conversation>;

    private constructor() {
        this.userRepository = getRepository(User);
        this.conversationRepository = getRepository(Conversation);
    }

    public static getInstance(): UserController {
        if (UserController.instance === undefined) {
            UserController.instance = new UserController();
        }
        return UserController.instance;
    }

    public async getByUsername(username: string): Promise<User> {
        return await this.userRepository.findOneOrFail({where: {username: username}});
    }

    public async getAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    public async delete(username: string): Promise<void> {
        await this.userRepository.softDelete(username);
    }

    public async update(username: string, props: UserProps): Promise<User> {
        await this.userRepository.update(username, props);
        return this.getByUsername(username);
    }

    public async getPosts(username: string): Promise<Post[]> {
        return await getRepository(Post)
            .createQueryBuilder()
            .leftJoin("Post.user", "User")
            .where("User.username=:username", {username})
            .getMany();
    }

    public async getConversations(username: string): Promise<Conversation[]> {
        return [].concat(await this.getOrganisationConversations(username))
            .concat(await this.getGroupConversations(username))
            .concat(await this.getFriendshipConversations(username))
            .sort((a: Conversation, b: Conversation) => a.messages[a.messages?.length - 1]?.createdAt.getTime() - b.messages[b.messages?.length - 1]?.createdAt.getTime());
    }

    public async getGroups(username: string): Promise<GroupMembership[]> {
        return await getRepository(GroupMembership)
            .createQueryBuilder()
            .leftJoinAndMapMany("GroupMembership.group", "GroupMembership.group", "Group")
            .leftJoin("GroupMembership.member", "User")
            .where("User.username=:username", {username})
            .getMany();
    }

    public async getEventsParticipation(username: string): Promise<Event[]> {
        return await getRepository(Event)
            .createQueryBuilder()
            .leftJoin("Event.participants", "User")
            .where("User.username=:username", {username})
            .getMany();
    }

    public async blockUser(currentUserId, id: string): Promise<void> {
        await this.userRepository.createQueryBuilder()
            .relation("blockedUsers")
            .of(currentUserId)
            .add(id);
    }

    public async unblockUser(currentUserId, id: string): Promise<void> {
        await this.userRepository.createQueryBuilder()
            .relation("blockedUsers")
            .of(currentUserId)
            .remove(id);
    }

    public async isBlocked(currentUserId: string, userId: string): Promise<boolean> {
        return (await this.userRepository.createQueryBuilder()
            .where("User.blockedUsers=:userId", {userId})
            .andWhere("User.blockers=:currentUserId", {currentUserId})
            .getOne() !== undefined);
    }

    public async reportUser(userReporter: User, reportedUser: User, props: ReportProps): Promise<Report> {
        const report = getRepository(Report).create({...props, userReporter, reportedUser});
        return await getRepository(Report).save(report);
    }

    public async getReports(username: string): Promise<Report[]> {
        return await getRepository(Report).createQueryBuilder()
            .leftJoin("Report.reportedUser", "ReportedUser")
            .where("ReportedUser.username=:username", {username})
            .getMany();
    }

    private async getOrganisationConversations(username: string): Promise<Conversation[]> {
        return await this.conversationRepository
            .createQueryBuilder()
            .leftJoinAndSelect("Conversation.organisation", "Organisation")
            .leftJoinAndSelect("Organisation.members", "OrganisationMembership")
            .leftJoinAndSelect("OrganisationMembership.user", "OrganisationMember")
            .where("OrganisationMember.username=:username", {username})
            .getMany();
    }

    private async getFriendshipConversations(username: string): Promise<Conversation[]> {
        return await this.conversationRepository
            .createQueryBuilder()
            .leftJoinAndSelect("Conversation.friendship", "Friendship")
            .leftJoinAndSelect("Friendship.friendOne", "FriendOne")
            .leftJoinAndSelect("Friendship.friendTwo", "FriendTwo")
            .where("FriendOne.username=:username", {username})
            .orWhere("FriendTwo.username=:username", {username})
            .leftJoin("Conversation.messages", "Message")
            .getMany()
    }

    private async getGroupConversations(username: string): Promise<Conversation[]> {
        return await this.conversationRepository
            .createQueryBuilder()
            .leftJoinAndSelect("Conversation.group", "Group")
            .leftJoinAndSelect("Group.members", "GroupMembership")
            .leftJoinAndSelect("GroupMembership.user", "GroupMember")
            .where("GroupMember.username=:username", {username})
            .leftJoin("Conversation.messages", "Message")
            .getMany();
    }

    async isFollowingOrganisation(username: string, organisationId: string) {
        return await this.userRepository
            .createQueryBuilder()
            .leftJoin("User.followedOrganisations", "Organisation")
            .where("Organisation.id=:organisationId", {organisationId})
            .andWhere("User.username=:username", {username})
            .getCount() > 0;
    }
}
