import {BeforeInsert, Entity, ManyToOne, OneToOne} from "typeorm";
import {User} from "./user.model";
import {Conversation} from "./conversation.model";

@Entity()
export class Friendship {
    @ManyToOne(() => User, user => user.friendsOne, {primary: true})
    friendOne: User;
    @ManyToOne(() => User, user => user.friendsTwo, {primary: true})
    friendTwo: User;
    @OneToOne(() => Conversation, conversation => conversation, {cascade: true})
    conversation: Conversation;

    @BeforeInsert()
    async setConversation() {
        this.conversation = new Conversation();
    }
}
