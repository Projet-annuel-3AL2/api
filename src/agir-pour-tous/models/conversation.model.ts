import {Message} from "./message.model";
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
import {Friendship} from "./friendship.model";
import {Group} from "./group.model";

@Entity()
export class Conversation {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @OneToMany(() => Message, message => message.conversation)
    messages: Message[];
    @OneToOne(() => Organisation, organisation => organisation.conversation)
    organisation: Organisation;
    @OneToOne(() => Friendship, friendship => friendship.conversation)
    friendship: Friendship;
    @OneToOne(() => Group, group => group.conversation)
    group: Group;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
