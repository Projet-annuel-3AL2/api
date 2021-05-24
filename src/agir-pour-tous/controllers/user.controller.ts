import {User, UserProps} from "../models/user.model";
import {getRepository, Repository} from "typeorm";
import {Post} from "../models/post.model";
import {Conversation} from "../models/conversation.model";
import {Group} from "../models/group.model";
import {GroupMembership} from "../models/group_membership.model";
import {Event} from "../models/event.model";

export class UserController {

    private static instance: UserController;

    private userRepository: Repository<User>;

    private constructor() {
        this.userRepository = getRepository(User);
    }

    public static getInstance(): UserController {
        if (UserController.instance === undefined) {
            UserController.instance = new UserController();
        }
        return UserController.instance;
    }

    public async getByUsername(username: string): Promise<User> {
        return await this.userRepository.findOneOrFail(username);
    }

    public async getAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    public async getById(userId: string): Promise<User> {
        return await this.userRepository.findOneOrFail(userId);
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
        return await getRepository(Conversation)
            .createQueryBuilder()
            .leftJoin("Conversation.organisation", "Organisation")
            .leftJoin("Conversation.group", "Group")
            .leftJoin("Conversation.friendship", "Friendship")
            .leftJoin("Friendship.friendOne", "FriendOne")
            .where("FriendOne.username=:username", {username})
            .leftJoin("Friendship.friendTwo", "FriendTwo")
            .where("FriendTwo.username=:username", {username})
            .leftJoin("Group.members", "GroupMember")
            .where("GroupMember.username=:username", {username})
            .leftJoin("Organisation.members", "OrganisationMember")
            .where("OrganisationMember.username=:username", {username})
            .leftJoin("Conversation.messages", "Message")
            .orderBy("Message.createdAt", "ASC")
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
            .where("User.username=:username", {username})
            .getMany();
    }
}
