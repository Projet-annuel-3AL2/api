import {Post} from "./post.model";
import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany, OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Report} from "./report.model";
import {GroupMembership} from "./group_membership.model";
import {Length} from "class-validator";
import {Conversation} from "./conversation.model";

@Entity()
export class Group {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Length(5,30)
    @Column({nullable:false, unique:true})
    name: string;
    @OneToMany(() => GroupMembership, user => user.group)
    members: GroupMembership[];
    @OneToMany(() => Post, post => post.group)
    posts: Post[];
    @OneToMany(() => Report, report => report.reportedGroup, {cascade: true})
    reported: Report[];
    @OneToOne(() => Conversation, conversation => conversation.group, {cascade: true})
    conversation: Conversation;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
    @BeforeInsert()
    async setConversation() {
        this.conversation = new Conversation();
    }
}
