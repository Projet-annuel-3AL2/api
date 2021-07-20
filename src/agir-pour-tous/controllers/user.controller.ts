import {User, UserProps} from "../models/user.model";
import {getRepository, Repository} from "typeorm";
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

    public async getPosts(username: string): Promise<Post[]> {
        return await getRepository(Post)
            .createQueryBuilder()
            .leftJoinAndSelect("Post.creator", "User")
            .leftJoinAndSelect("Post.sharesPost", "SharedPost")
            .leftJoinAndSelect("Post.sharedEvent", "SharedEvent")
            .leftJoinAndSelect("User.profilePicture", "ProfilePicture")
            .leftJoinAndSelect("User.certification", "Certification")
            .where("User.username=:username", {username})
            .orderBy("Post.createdAt","DESC")
            .getMany();
    }

    public async getConversations(username: string): Promise<Conversation[]> {
        return [].concat(await this.getOrganisationConversations(username))
            .concat(await this.getGroupConversations(username))
            .concat(await this.getFriendshipConversations(username))
            .sort((a: Conversation, b: Conversation) => {
                if(!a.messages) return -1;
                if(!b.messages) return 1;
                return a.messages[a.messages?.length - 1]?.createdAt.getTime() - b.messages[b.messages?.length - 1]?.createdAt.getTime()
            });
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

    public async getOrganisations(username: string): Promise<Organisation[]> {
        return await getRepository(Organisation)
            .createQueryBuilder()
            .leftJoin("Organisation.members", "OrganisationMembership")
            .leftJoin("OrganisationMembership.user", "User")
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
            .leftJoin("User.blockedUsers","Blocked")
            .where("Blocked.username=:blocked", {blocked})
            .andWhere("User.username=:blocker", {blocker})
            .getOne() !== undefined);
    }

    public async hasBlocked(blocker: string, blocked: string): Promise<boolean>{
        return (await this.userRepository.createQueryBuilder()
            .leftJoin("User.blockers","Blocker")
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

    private async getOrganisationConversations(username: string): Promise<Conversation[]> {
        return await this.conversationRepository
            .createQueryBuilder()
            .leftJoinAndSelect("Conversation.organisation", "Organisation")
            .leftJoinAndSelect("Organisation.members", "OrganisationMembership")
            .leftJoinAndSelect("OrganisationMembership.user", "OrganisationMember")
            .leftJoinAndSelect("Organisation.profilePicture", "ProfPic")
            .where("OrganisationMember.username=:username", {username})
            .getMany();
    }

    private async getFriendshipConversations(username: string): Promise<Conversation[]> {
        return await this.conversationRepository
            .createQueryBuilder()
            .leftJoinAndSelect("Conversation.friendship", "Friendship")
            .leftJoinAndSelect("Friendship.friendOne", "FriendOne")
            .leftJoinAndSelect("Friendship.friendTwo", "FriendTwo")
            .leftJoinAndSelect("FriendOne.profilePicture", "ProfPic1")
            .leftJoinAndSelect("FriendTwo.profilePicture", "ProfPic2")
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

    public async getFriends(username: string): Promise<User[]>{
        return (await this.getFriendsOne(username))
            .concat(await this.getFriendsTwo(username));
    }

    private async getFriendsOne(username: string): Promise<User[]>{
        return this.userRepository.createQueryBuilder()
            .leftJoin("User.friendsTwo","FriendshipTwo")
            .leftJoin("FriendshipTwo.friendOne","FriendOne")
            .where("FriendOne.username=:username",{username})
            .getMany();
    }

    private async getFriendsTwo(username: string): Promise<User[]>{
        return this.userRepository.createQueryBuilder()
            .leftJoin("User.friendsOne","FriendshipOne")
            .leftJoin("FriendshipOne.friendTwo","FriendTwo")
            .where("FriendTwo.username=:username",{username})
            .getMany();
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

    async getOrganisationInvitations(id: string) {
        return await this.userRepository.createQueryBuilder()
            .leftJoinAndSelect("User.organisationInvitations", "OrganisationInvitations")
            .where("User.id=:id", {id})
            .getOne();
    }
}
