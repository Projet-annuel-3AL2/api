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

    public async getById(id: string): Promise<User> {
        return await this.userRepository.findOneOrFail(id);
    }

    public async getAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    public async delete(id: string): Promise<void> {
        await this.userRepository.softDelete(id);
    }

    public async update(id: string, props: UserProps): Promise<User> {
        await this.userRepository.update(id, props);
        return this.getById(id);
    }

    public async getPosts(id: string): Promise<Post[]> {
        return await getRepository(Post)
            .createQueryBuilder()
            .leftJoin("Post.user", "User")
            .where("User.id=:id", {id})
            .getMany();
    }

    public async getConversations(id: string): Promise<Conversation[]> {
        return await getRepository(Conversation)
            .createQueryBuilder()
            .leftJoin("Conversation.friendship", "Friendship")
            .leftJoin("Friendship.friendOne", "FriendOne")
            .where("FriendOne.id=:id", {id})
            .leftJoin("Friendship.friendTwo", "FriendTwo")
            .where("FriendTwo.id=:id", {id})
            .leftJoin("Conversation.group", "Group")
            .leftJoin("Group.members", "GroupMembership")
            .leftJoin("GroupMembership.user","GroupMember")
            .where("GroupMember.id=:id", {id})
            .leftJoin("Conversation.organisation", "Organisation")
            .leftJoin("Organisation.members", "OrganisationMembership")
            .leftJoin("OrganisationMembership.user", "OrganisationMember")
            .where("OrganisationMember.id=:id", {id})
            .leftJoin("Conversation.messages", "Message")
            .orderBy("Message.createdAt", "ASC")
            .getMany();
    }

    public async getGroups(id: string): Promise<GroupMembership[]> {
        return await getRepository(GroupMembership)
            .createQueryBuilder()
            .leftJoinAndMapMany("GroupMembership.group", "GroupMembership.group", "Group")
            .leftJoin("GroupMembership.member", "User")
            .where("User.id=:id", {id})
            .getMany();
    }

    public async getEventsParticipation(id: string): Promise<Event[]> {
        return await getRepository(Event)
            .createQueryBuilder()
            .leftJoin("Event.participants", "User")
            .where("User.id=:id", {id})
            .getMany();
    }
}
