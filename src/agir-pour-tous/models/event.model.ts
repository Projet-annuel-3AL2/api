import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, JoinTable,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {UserToEvent} from "./userToEvent.model";
import {Post} from "./post.model";
import {User} from "./user.model";

export enum EventTypeEnum{
    CLASSIC = "CLASSIC",
    BEACH = "BEACH"
}

export enum EventStatusEnum{
    PENDING= "PENDING",
    VALIDATE = "VALIDATE",
    ONGOING = "ONGOING",
    FINISH = "FINISH",
}

export interface EventProps {
    name: string,
    description: string,
    type: EventTypeEnum,
    location: string,
    status: EventStatusEnum,
    private: boolean
}

@Entity({schema: "agir_pour_tous"})
export class Event implements EventProps {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    description: string;

    @Column({nullable: false})
    location: string;

    @Column({nullable: false, unique: true})
    name: string;

    @Column({default: false})
    private: boolean;

    @Column({
        type: "enum",
        enum: EventStatusEnum,
        default: "PENDING"
    })
    status: EventStatusEnum;

    @Column({
        type: "enum",
        enum: EventTypeEnum,
        default: "CLASSIC"
    })
    type: EventTypeEnum;

    /*
        IdUser Who CreateIt
     */
    @Column()
    owner: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @OneToMany(() => UserToEvent, userToEvent => userToEvent.event)
    userToEvent: UserToEvent[];

    @OneToMany(() => Post, post => post.event)
    posts: Post[];
}
