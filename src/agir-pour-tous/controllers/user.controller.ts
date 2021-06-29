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

    public async getById(id: string): Promise<User> {
        return await this.userRepository.findOneOrFail(id);
    }

    public async getWithUsername(username: string): Promise<User> {
        return await this.userRepository.findOne({
            where: {
                username: username
            },
            relations: []
        })
    }

    public async getFullUser(username: string): Promise<User> {
        return await this.userRepository.findOne({
            where: {
                username: username
            },
            relations: [
                'eventsParticipation',
                'eventsParticipation.organisation',
                "eventsParticipation.category",
                "eventsParticipation.participants",
                "eventsParticipation.user"
            ]
        })
    }

    public async getPostWithUsername(username: string): Promise<User> {
        return await this.userRepository.findOne({
            where: {
                username: username
            }
        })
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

        return [].concat(await this.getOrganisationConversations(id))
            .concat(await this.getGroupConversations(id))
            .concat(await this.getFriendshipConversations(id))
            .sort((a:Conversation, b:Conversation) => a.messages[a.messages?.length-1]?.createdAt.getTime() - b.messages[b.messages?.length-1]?.createdAt.getTime());
    }

    private async getOrganisationConversations(id: string): Promise<Conversation[]> {
        return await this.conversationRepository
            .createQueryBuilder()
            .leftJoinAndSelect("Conversation.organisation", "Organisation")
            .leftJoinAndSelect("Organisation.members", "OrganisationMembership")
            .leftJoinAndSelect("OrganisationMembership.user", "OrganisationMember")
            .where("OrganisationMember.id=:id", {id})
            .getMany();
    }

    private async getFriendshipConversations(id: string): Promise<Conversation[]>{
        return await this.conversationRepository
            .createQueryBuilder()
            .leftJoinAndSelect("Conversation.friendship", "Friendship")
            .leftJoinAndSelect("Friendship.friendOne", "FriendOne")
            .leftJoinAndSelect("Friendship.friendTwo", "FriendTwo")
            .where("FriendOne.id=:id", {id})
            .orWhere("FriendTwo.id=:id", {id})
            .leftJoin("Conversation.messages", "Message")
            .getMany()
    }

    private async getGroupConversations(id: string): Promise<Conversation[]>{
        return await this.conversationRepository
            .createQueryBuilder()
            .leftJoinAndSelect("Conversation.group", "Group")
            .leftJoinAndSelect("Group.members", "GroupMembership")
            .leftJoinAndSelect("GroupMembership.user","GroupMember")
            .where("GroupMember.id=:id", {id})
            .leftJoin("Conversation.messages", "Message")
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
