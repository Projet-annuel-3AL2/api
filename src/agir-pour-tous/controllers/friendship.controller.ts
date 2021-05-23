import {getRepository, Repository} from "typeorm";
import {Friendship} from "../models/friendship.model";
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
        const friendRequest = this.friendRequestRepository.create({sender,user});
        return this.friendRequestRepository.save(friendRequest);
    }

    public async cancelFriendRequest(senderUsername: string, username: string): Promise<void> {
        await this.friendRequestRepository.createQueryBuilder()
            .leftJoin("FriendRequest.user", "User")
            .where("User.username=:username",{username})
            .leftJoin("FriendRequest.sender","Sender")
            .andWhere("Sender.username=:senderUsername", {senderUsername})
            .softDelete()
            .execute();
    }

    public async acceptFriendRequest(friendOne: User, friendTwo: User): Promise<Friendship> {
        const friendRequest = this.friendshipRepository.create({friendOne,friendTwo});
        return this.friendshipRepository.save(friendRequest);
    }

    public async removeFriendship(friendOneUsername: string, friendTwoUsername: string): Promise<void> {
        await this.friendshipRepository.createQueryBuilder()
            .leftJoin("Friendship.friendOne", "FriendOne")
            .where("FriendOne.username=:friendOneUsername",{friendOneUsername})
            .leftJoin("FriendRequest.friendTwo","FriendTwo")
            .andWhere("FriendTwo.username=:friendTwoUsername", {friendTwoUsername})
            .softDelete()
            .execute();
    }
}
