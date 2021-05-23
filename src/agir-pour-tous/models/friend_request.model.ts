import {User} from "./user.model";
import {CreateDateColumn, Entity, ManyToOne} from "typeorm";

@Entity()
export class FriendRequest {
    @ManyToOne(()=>User, user => user, {primary:true, eager:true})
    sender: User;
    @ManyToOne(()=>User, user => user, {primary:true})
    user: User;
    @CreateDateColumn()
    createdAt: Date;
}
