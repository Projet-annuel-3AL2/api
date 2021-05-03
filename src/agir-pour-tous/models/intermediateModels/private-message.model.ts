import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../user.model";

export interface PrivateMessageProps{
    text: string,
}

@Entity({schema: "agir_pour_tous"})
export class PrivateMessage implements PrivateMessageProps{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    text: string;

    @ManyToOne(() => User, user => user.privateMessageSender)
    idUserSender: User;

    @ManyToOne(() => User, user => user.privateMessageTarget)
    idUserTarget: User;
}
