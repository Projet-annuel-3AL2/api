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
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Category} from "./category.model";
import {Report} from "./report.model";
import {IsLatitude, IsLongitude, Length} from "class-validator";
import {Media} from "./media.model";

export interface EventProps {
    name: string;
    startDate: Date;
    endDate: Date;
    latitude: number;
    longitude: number;
    organisation?: Organisation;
    user: User;
}

@Entity()
export class Event {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Length(5, 50)
    @Column({nullable: false, length: 50})
    name: string;
    @Length(0, 200)
    @Column({nullable: false, length: 200})
    description: string;
    @Column({nullable: false})
    startDate: Date;
    @Column({nullable: false})
    endDate: Date;
    @IsLatitude()
    @Column({type: "float", nullable: false})
    latitude: number;
    @IsLongitude()
    @Column({type: "float", nullable: false})
    longitude: number;
    @Column({nullable: true})
    participantsLimit: number;
    @ManyToOne(() => Organisation, organisation => organisation.events)
    organisation: Organisation;
    @ManyToOne(() => User, user => user.createdEvents)
    user: User;
    @ManyToMany(() => User, user => user.eventsParticipation)
    participants: User[];
    @OneToMany(() => Post, post => post.sharedEvent)
    posts: Post[];
    @ManyToOne(() => Category, category => category.events, {nullable: false})
    category: Category;
    @OneToOne(() => Media, media => media.eventPicture, {nullable: true, cascade: true})
    picture: Media;
    @OneToMany(() => Report, report => report.reportedEvent)
    reported: Report[];
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
