import {Message} from "./message.model";
import {User} from "./user.model";
import {Organisation} from "./organisation.model";
import {
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

@Entity()
export class Conversation {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @OneToMany(() => Message, message => message.conversation)
    messages: Message[];
    @ManyToMany(() => User, user => user.conversations)
    members: User[];
    @OneToOne(() => Organisation, organisation => organisation.conversation)
    organisation: Organisation;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
