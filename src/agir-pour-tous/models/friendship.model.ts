import {Entity, ManyToOne, OneToOne} from "typeorm";
import {User} from "./user.model";
import {Conversation} from "./conversation.model";

@Entity()
export class Friendship {
    @ManyToOne(()=> User, user=> user.friends, {primary:true})
    friendOne: User;
    @ManyToOne(()=> User, user=> user.friends, {primary:true})
    friendTwo: User;

    @OneToOne(()=> Conversation, conversation => conversation)
    conversation: Conversation;
}
