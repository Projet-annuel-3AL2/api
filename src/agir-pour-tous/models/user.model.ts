import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, JoinTable,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {UserToEvent} from "./intermediateModels/user-to-event.model";
import {Follow} from "./intermediateModels/follow.model";
import {Badge} from "./badge.model";
import {Location} from "./location.model"
import {PrivateMessage} from "./intermediateModels/private-message.model";
import {Approval} from "./intermediateModels/approval.model";
import {Post} from "./post.model";
import {Comment} from "./comment.model";

export enum UserEnum{
    ADMIN = "ADMIN",
    VISITOR = "VISITOR",
    ORGANISATION = "ORGANISATION",
    MODERATOR = "MODERATOR"
}

export interface UserProps{
    name : string,
    surname : string,
    username : string,
    password : string,
    typeOfUser : UserEnum,
    notifLocation : boolean,
    notifFriends : boolean
}

@Entity({schema: "agir_pour_tous"})
export class User implements UserProps{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false, unique: true})
    username: string;

    @Column( {nullable: false})
    password: string;

    @Column({nullable: false, unique: true})
    name: string;

    @Column()
    surname: string;

    @Column( {default: true})
    notifFriends: boolean;

    @Column( {default: true})
    notifLocation: boolean;

    @Column({
        type: "enum",
        enum: UserEnum,
        default: "VISITOR"
    })
    typeOfUser: UserEnum;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @OneToMany(() => UserToEvent, userToEvent => userToEvent.user)
    userToEvent: UserToEvent[];

    @OneToMany(() => Follow, follow => follow.follower)
    follower : User[];

    @OneToMany(() => Follow, follow => follow.followed)
    followed : User[];

    @OneToMany(() => Badge, badge => badge.users)
    badges : Badge[];

    @OneToMany(() => Location, location => location.users)
    locations : Location[];

    @OneToMany(() => PrivateMessage, privateMessage => privateMessage.idUserTarget)
    privateMessageTarget: User[];

    @OneToMany(() => PrivateMessage, privateMessage => privateMessage.idUserSender)
    privateMessageSender: User[];

    @OneToMany(() => Approval, approval => approval.userTarget)
    approvalTarget: Approval[];

    @OneToMany(() => Approval, approval => approval.userVoter)
    approvalVoter: Approval[];

    @OneToMany(() => Post, post => post.owner)
    posts: Post[];

    @OneToMany(() => Comment, comment => comment.user)
    comments: Comment[];
}
