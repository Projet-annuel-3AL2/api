import {getRepository, Repository} from "typeorm";
import {Conversation} from "../models/conversation.model";
import {User} from "../models/user.model";
import {Message, MessageProps} from "../models/message.model";
import {validate} from "class-validator";

export class ConversationController {
    private static instance: ConversationController;

    private conversationRepository: Repository<Conversation>;
    private messageRepository: Repository<Message>;

    private constructor() {
        this.conversationRepository = getRepository(Conversation);
        this.messageRepository = getRepository(Message);
    }

    public static getInstance(): ConversationController {
        if (ConversationController.instance === undefined) {
            ConversationController.instance = new ConversationController();
        }
        return ConversationController.instance;
    }

    public async getById(id: string): Promise<Conversation> {
        return this.conversationRepository.findOneOrFail(id);
    }

    public async getMessages(id: string): Promise<Message[]> {
        return this.messageRepository.createQueryBuilder()
            .leftJoinAndSelect("Message.user", "User")
            .leftJoin("Message.conversation", "Conversation")
            .where("Conversation.id=:id", {id})
            .orderBy("Message.createdAt", "ASC")
            .getMany();
    }

    public async getLastMessage(id: string): Promise<Message> {
        return this.messageRepository.createQueryBuilder()
            .leftJoinAndSelect("Message.user", "User")
            .leftJoin("Message.conversation", "Conversation")
            .where("Conversation.id=:id", {id})
            .orderBy("Message.createdAt", "DESC")
            .limit(1)
            .getOne();
    }

    public async sendMessage(user: User, conversation: Conversation, props: MessageProps): Promise<Message> {
        const message = this.messageRepository.create({...props, user, conversation});
        const err = await validate(message);
        if (err.length > 0) {
            throw err;
        }
        return this.messageRepository.save(message);
    }

    public async getMembers(conversationId: string): Promise<User[]> {
        return (await this.getFriendOne(conversationId))
            .concat(await this.getFriendTwo(conversationId))
            .concat(await this.getGroupMembers(conversationId))
            .concat(await this.getOrganisationMembers(conversationId));
    }

    public async getFriendOne(conversationId: string): Promise<User[]> {
        return await getRepository(User).createQueryBuilder()
            .leftJoin("User.friendsOne", "Friendship")
            .leftJoin("Friendship.conversation", "Conversation")
            .where("Conversation.id=:conversationId", {conversationId})
            .getMany();
    }

    public async getFriendTwo(conversationId: string): Promise<User[]> {
        return await getRepository(User).createQueryBuilder()
            .leftJoin("User.friendsTwo", "Friendship")
            .leftJoin("Friendship.conversation", "Conversation")
            .where("Conversation.id=:conversationId", {conversationId})
            .getMany();
    }

    public async getOrganisationMembers(conversationId: string): Promise<User[]> {
        return await getRepository(User).createQueryBuilder()
            .leftJoin("User.organisations", "OrganisationMembership")
            .leftJoin("OrganisationMembership.organisation", "Organisation")
            .leftJoin("Organisation.conversation", "Conversation")
            .where("Conversation.id=:conversationId", {conversationId})
            .getMany();
    }

    public async getGroupMembers(conversationId: string): Promise<User[]> {
        return await getRepository(User).createQueryBuilder()
            .leftJoin("User.groups", "GroupMembership")
            .leftJoin("GroupMembership.group", "Group")
            .leftJoin("Group.conversation", "Conversation")
            .where("Conversation.id=:conversationId", {conversationId})
            .getMany();
    }
}
