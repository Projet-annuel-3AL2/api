import {User} from "./user.model";
import {CreateDateColumn, Entity, ManyToOne} from "typeorm";

@Entity()
export class FriendRequest {
    @ManyToOne(() => User, user => user, {primary: true, eager: true, cascade:true, onDelete:"CASCADE"})
    sender: User;
    @ManyToOne(() => User, user => user, {primary: true, cascade:true, onDelete:"CASCADE"})
    user: User;
    @CreateDateColumn()
    createdAt: Date;
}
