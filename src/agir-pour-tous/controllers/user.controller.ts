import {User, UserProps} from "../models/user.model";
import {getRepository, Repository, SelectQueryBuilder} from "typeorm";
import {Post} from "../models/post.model";
import {Conversation} from "../models/conversation.model";
import {Group} from "../models/group.model";
import {GroupMembership} from "../models/group_membership.model";
import {Event} from "../models/event.model";
import {Report, ReportProps} from "../models/report.model";
import {Organisation} from "../models/organisation.model";
import {Media} from "../models/media.model";

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
        await this.userRepository.createQueryBuilder()
            .where("username=:username", {username})
            .softDelete()
            .execute();
    }

    public async update(username: string, props: UserProps): Promise<User> {
        await this.userRepository.createQueryBuilder()
            .update()
            .set(props)
            .where("username=:username", {username})
            .execute()
        return this.getByUsername(username);
    }

    public async getPosts(username: string, limit: number, offset: number): Promise<Post[]> {
        return await getRepository(Post)
            .createQueryBuilder()
            .leftJoinAndSelect("Post.creator", "User")
            .leftJoinAndSelect("Post.sharesPost", "SharedPost")
            .leftJoinAndSelect("Post.sharedEvent", "SharedEvent")
            .leftJoinAndSelect("User.profilePicture", "ProfilePicture")
            .leftJoinAndSelect("User.certification", "Certification")
            .where("User.username=:username", {username})
            .orderBy("Post.createdAt", "DESC")
            .limit(limit)
            .offset(offset)
            .getMany();
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
            .leftJoin("Event.user", "Owner")
            .where("User.username=:username", {username})
            .orWhere("Owner.username=:username", {username})
            .getMany();
    }

    public async getOrganisations(username: string): Promise<Organisation[]> {
        return await getRepository(Organisation)
            .createQueryBuilder()
            .leftJoin("Organisation.members", "OrganisationMembership")
            .leftJoin("OrganisationMembership.user", "User")
            .leftJoinAndSelect("Organisation.profilePicture", "ProfilePicture")
            .where("User.username=:username", {username})
            .getMany();
    }

    public async blockUser(currentUserId: string, userId: string): Promise<void> {
        await this.userRepository.createQueryBuilder()
            .relation("blockedUsers")
            .of(currentUserId)
            .add(userId);
    }

    public async unblockUser(currentUserId: string, userId: string): Promise<void> {
        await this.userRepository.createQueryBuilder()
            .relation("blockedUsers")
            .of(currentUserId)
            .remove(userId);
    }

    public async isBlocked(blocker: string, blocked: string): Promise<boolean> {
        return (await this.userRepository.createQueryBuilder()
            .leftJoin("User.blockedUsers", "Blocked")
            .where("Blocked.username=:blocked", {blocked})
            .andWhere("User.username=:blocker", {blocker})
            .getOne() !== undefined);
    }

    public async hasBlocked(blocker: string, blocked: string): Promise<boolean> {
        return (await this.userRepository.createQueryBuilder()
            .leftJoin("User.blockers", "Blocker")
            .where("Blocker.username=:blocker", {blocker})
            .andWhere("User.username=:blocked", {blocked})
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

    async isFollowingOrganisation(userId: string, organisationId: string) {
        return await this.userRepository
            .createQueryBuilder()
            .leftJoin("User.followedOrganisations", "Organisation")
            .where("Organisation.id=:organisationId", {organisationId})
            .andWhere("User.id=:userId", {userId})
            .getOne() != undefined;
    }

    public async getFriends(username: string): Promise<User[]> {
        return (await this.getFriendsOne(username))
            .concat(await this.getFriendsTwo(username));
    }

    public async setProfilePicture(userId: string, profilePicture: Promise<Media>) {
        await this.userRepository.createQueryBuilder()
            .relation("profilePicture")
            .of(userId)
            .set(profilePicture);
    }

    public async removeProfilePicture(userId: string) {
        await this.userRepository.createQueryBuilder()
            .relation("profilePicture")
            .of(userId)
            .set(null);
    }

    async getAllReport(): Promise<Report[]> {
        return await getRepository(Report).createQueryBuilder()
            .leftJoinAndSelect("Report.userReporter", "UserReporter")
            .leftJoinAndSelect("Report.reportedUser", "reportedUser")
            .where("Report.reportedUser is not null")
            .getMany()
    }

    async countReport(userId: string) {
        return await getRepository(Report).createQueryBuilder()
            .leftJoinAndSelect("Report.reportedUser", "ReportedUser")
            .leftJoinAndSelect("Report.userReporter", "UserReporter")
            .where("ReportedUser.id =:userId", {userId})
            .getCount();
    }

    async deleteReport(reportId: any) {
        return await getRepository(Report).createQueryBuilder()
            .where("Report.id=:reportId", {reportId})
            .softDelete()
            .execute();
    }

    async getOrganisationInvitations(id: string): Promise<Organisation[]> {
        return await getRepository(Organisation).createQueryBuilder()
            .leftJoinAndSelect("Organisation.invitedUsers", "User")
            .leftJoinAndSelect("Organisation.profilePicture", "ProfilePicture")
            .where("User.id=:id", {id})
            .getMany();
    }

    public async getConversations(username: string): Promise<Conversation[]> {
         let query = await this.conversationRepository
            .createQueryBuilder()
            .leftJoin("Conversation.messages", "Message")
            .orderBy("Message.createdAt","DESC")
            .addOrderBy("Conversation.createdAt","DESC")
        UserController.getOrganisationConversations(username,query);
        UserController.getFriendshipConversations(username,query);
        UserController.getGroupConversations(username,query);
        return query.getMany();
    }

    private static getOrganisationConversations(username: string, query: SelectQueryBuilder<Conversation>): SelectQueryBuilder<Conversation> {
        return query
            .leftJoinAndSelect("Conversation.organisation", "Organisation")
            .leftJoinAndSelect("Organisation.members", "OrganisationMembership")
            .leftJoinAndSelect("OrganisationMembership.user", "OrganisationMember")
            .leftJoinAndSelect("Organisation.profilePicture", "ProfPic")
            .orWhere("OrganisationMember.username=:username", {username})
    }

    private static getFriendshipConversations(username: string, query: SelectQueryBuilder<Conversation>): SelectQueryBuilder<Conversation> {
        return query
            .leftJoinAndSelect("Conversation.friendship", "Friendship")
            .leftJoinAndSelect("Friendship.friendOne", "FriendOne")
            .leftJoinAndSelect("Friendship.friendTwo", "FriendTwo")
            .leftJoinAndSelect("FriendOne.profilePicture", "ProfPic1")
            .leftJoinAndSelect("FriendTwo.profilePicture", "ProfPic2")
            .orWhere("FriendOne.username=:username", {username})
            .orWhere("FriendTwo.username=:username", {username})
    }

    private static getGroupConversations(username: string, query: SelectQueryBuilder<Conversation>): SelectQueryBuilder<Conversation> {
        return query
            .leftJoinAndSelect("Conversation.group", "Group")
            .leftJoinAndSelect("Group.members", "GroupMembership")
            .leftJoinAndSelect("GroupMembership.user", "GroupMember")
            .orWhere("GroupMember.username=:username", {username})
    }

    private async getFriendsOne(username: string): Promise<User[]> {
        return this.userRepository.createQueryBuilder()
            .leftJoin("User.friendsTwo", "FriendshipTwo")
            .leftJoin("FriendshipTwo.friendOne", "FriendOne")
            .where("FriendOne.username=:username", {username})
            .getMany();
    }

    private async getFriendsTwo(username: string): Promise<User[]> {
        return this.userRepository.createQueryBuilder()
            .leftJoin("User.friendsOne", "FriendshipOne")
            .leftJoin("FriendshipOne.friendTwo", "FriendTwo")
            .where("FriendTwo.username=:username", {username})
            .getMany();
    }
}
