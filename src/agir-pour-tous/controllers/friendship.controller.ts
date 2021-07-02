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
        await this.friendRequestRepository.delete(await this.friendRequestRepository.createQueryBuilder()
            .leftJoin("FriendRequest.user", "User")
            .where("User.username=:username", {username})
            .leftJoin("FriendRequest.sender", "Sender")
            .andWhere("Sender.username=:senderUsername", {senderUsername})
            .getOne());
    }

    public async acceptFriendRequest(friendOne: User, friendTwo: User): Promise<Friendship> {
        const friendRequest = this.friendshipRepository.create({friendOne, friendTwo});
        return this.friendshipRepository.save(friendRequest);
    }

    public async removeFriendship(friendOneUsername: string, friendTwoUsername: string): Promise<void> {
        await this.friendshipRepository.createQueryBuilder()
            .leftJoin("Friendship.friendOne", "FriendOne")
            .where("FriendOne.username=:friendOneUsername", {friendOneUsername})
            .leftJoin("FriendRequest.friendTwo", "FriendTwo")
            .andWhere("FriendTwo.username=:friendTwoUsername", {friendTwoUsername})
            .softDelete()
            .execute();
    }

    public async isFriendshipRequested(currentUsername: string, username: string): Promise<FriendshipStatus> {
        if (await this.friendshipRepository.createQueryBuilder()
            .leftJoin("Friendship.friendOne", "FriendOne")
            .leftJoin("Friendship.friendTwo", "FriendTwo")
            .where("FriendOne.username=:currentUsername AND FriendTwo.username=:username", {currentUsername, username})
            .orWhere("FriendOne.username=:username AND FriendTwo.username=:currentUsername", {
                currentUsername,
                username
            })
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
