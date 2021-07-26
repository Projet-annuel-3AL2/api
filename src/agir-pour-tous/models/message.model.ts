import {User} from "./user.model";
import {Conversation} from "./conversation.model";
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

export interface MessageProps {
    text: string;
    user: User;
    conversation: Conversation;
}

@Entity()
export class Message {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column()
    text: string;
    @ManyToOne(() => User, user => user.messages, {onDelete: 'CASCADE'})
    user: User;
    @ManyToOne(() => Conversation, conversation => conversation.messages)
    conversation: Conversation;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
