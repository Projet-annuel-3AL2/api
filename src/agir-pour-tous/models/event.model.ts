import {Post} from "./post.model";
import {User} from "./user.model";
import {Organisation} from "./organisation.model";
import {
    Column,
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
import {Report} from "./report.model";
import {Length} from "class-validator";

export interface EventProps {
    name: string;
}
@Entity()
export class Event {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column({length: 100, nullable: false, unique: true})
    @Length(5, 100)
    name: string;
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
    @OneToMany(() => Report, report => report.reportedEvent)
    reported: Report[];
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
