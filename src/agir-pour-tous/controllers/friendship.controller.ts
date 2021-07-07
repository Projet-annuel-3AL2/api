import {getRepository, Repository} from "typeorm";
import {Friendship, FriendshipStatus} from "../models/friendship.model";
import {FriendRequest} from "../models/friend_request.model";
import {User} from "../models/user.model";

export class FriendshipController {
    private static instance: FriendshipController;

    private friendshipRepository: Repository<Friendship>;
    private friendRequestRepository: Repository<FriendRequest>;

    private constructor() {
        this.friendshipRepository = getRepository(Friendship);
        this.friendRequestRepository = getRepository(FriendRequest);
    }

    public static getInstance(): FriendshipController {
        if (FriendshipController.instance === undefined) {
            FriendshipController.instance = new FriendshipController();
        }
        return FriendshipController.instance;
    }

    public async sendFriendRequest(sender: User, user: User): Promise<FriendRequest> {
        const friendRequest = this.friendRequestRepository.create({sender, user});
        return this.friendRequestRepository.save(friendRequest);
    }

    public async cancelFriendRequest(senderUsername: string, username: string): Promise<void> {
        await this.friendRequestRepository.remove(await this.friendRequestRepository.createQueryBuilder()
            .leftJoinAndSelect("FriendRequest.user", "User")
            .where("User.username=:username", {username})
            .leftJoinAndSelect("FriendRequest.sender", "Sender")
            .andWhere("Sender.username=:senderUsername", {senderUsername})
            .getOne());
    }

    public async acceptFriendRequest(friendOne: User, friendTwo: User): Promise<Friendship> {
        const friendRequest = this.friendshipRepository.create({friendOne, friendTwo});
        await this.cancelFriendRequest(friendOne.username, friendTwo.username);
        return this.friendshipRepository.save(friendRequest);
    }

    public async removeFriendship(friendOneUsername: string, friendTwoUsername: string): Promise<void> {

        await this.friendshipRepository.remove(await this.friendshipRepository.createQueryBuilder()
            .leftJoinAndSelect("Friendship.friendOne", "FriendOne")
            .leftJoinAndSelect("Friendship.friendTwo", "FriendTwo")
            .where("FriendOne.username=:friendOneUsername and FriendTwo.username=:friendTwoUsername ", {friendOneUsername, friendTwoUsername})
            .orWhere("FriendOne.username=:friendTwoUsername or FriendTwo.username=:friendOneUsername", {friendTwoUsername, friendOneUsername})
            .getOne());
    }

    public async isFriendshipRequested(currentUsername: string, username: string): Promise<FriendshipStatus> {
        if (await this.friendshipRepository.createQueryBuilder()
            .leftJoinAndSelect("Friendship.friendOne", "FriendOne")
            .leftJoinAndSelect("Friendship.friendTwo", "FriendTwo")
            .where("(FriendOne.username=:currentUsername AND FriendTwo.username=:username)", {currentUsername, username})
            .orWhere("(FriendOne.username=:username AND FriendTwo.username=:currentUsername)", {currentUsername,username})
            .getOne() !== undefined) {
            return FriendshipStatus.BEFRIENDED;
        } else if (await this.friendRequestRepository.createQueryBuilder()
            .leftJoin("FriendRequest.sender", "Sender")
            .leftJoin("FriendRequest.user", "User")
            .where("Sender.username=:currentUsername and User.username=:username", {currentUsername, username})
            .getOne() !== undefined) {
            return FriendshipStatus.PENDING;
        } else if (await this.friendRequestRepository.createQueryBuilder()
            .leftJoin("FriendRequest.sender", "Sender")
            .leftJoin("FriendRequest.user", "User")
            .where("Sender.username=:username and User.username=:currentUsername", {currentUsername, username})
            .getOne() !== undefined) {
            return FriendshipStatus.RECEIVED;
        }
        return FriendshipStatus.NONE;
    }

    public async sentFriendshipRequest(id: string): Promise<FriendRequest[]> {
        return this.friendRequestRepository.createQueryBuilder()
            .leftJoin("FriendRequest.sender", "Sender")
            .where("Sender.id=:id", {id})
            .getMany();
    }

    public async receivedFriendshipRequest(id: string): Promise<FriendRequest[]> {
        return this.friendRequestRepository.createQueryBuilder()
            .leftJoin("FriendRequest.user", "User")
            .where("User.id=:id", {id})
            .getMany();
    }
}
