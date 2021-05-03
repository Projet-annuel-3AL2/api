import {CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Event} from "../event.model";
import {User} from "../user.model";

@Entity({schema: "agir_pour_tous"})
export class UserToEvent{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => Event, event => event.userToEvent)
    event: Event;

    @ManyToOne(() => User, user => user.userToEvent)
    user: User;
}
