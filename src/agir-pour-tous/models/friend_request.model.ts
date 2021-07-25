import {User} from "./user.model";
import {CreateDateColumn, Entity, ManyToOne} from "typeorm";

@Entity()
export class FriendRequest {
    @ManyToOne(() => User, user => user, {primary: true, eager: true, onDelete:"CASCADE"})
    sender: User;
    @ManyToOne(() => User, user => user, {primary: true, onDelete:"CASCADE"})
    user: User;
    @CreateDateColumn()
    createdAt: Date;
}
