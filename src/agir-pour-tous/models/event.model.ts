import {Post} from "./post.model";
import {User} from "./user.model";
import {Organisation} from "./organisation.model";
import {
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Category} from "./category.model";

@Entity()
export class Event {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @ManyToOne(() => Organisation, organisation => organisation.events)
    organisation: Organisation;
    @ManyToOne(() => User, user => user.createdEvents)
    user: User;
    @ManyToMany(() => User, user => user.eventsParticipation)
    participants: User[];
    @OneToMany(() => Post, post => post.sharedEvent)
    posts: Post[];
    @ManyToOne(() => Category, category => category.events)
    category: Category;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
