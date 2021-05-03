import {CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Event} from "../event.model";
import {User} from "../user.model";

@Entity({schema: "agir_pour_tous"})
export class Follow{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => User, user => user.follower)
    follower: User;

    @ManyToOne(() => User, user => user.followed)
    followed: User;

}
