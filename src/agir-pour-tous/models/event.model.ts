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

@Entity()
export class Event {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Length(5, 30)
    @Column({nullable: false, length: 50})
    name: string;
    @Column({nullable: false})
    startDate: Date;
    @Column({nullable: false})
    endDate: Date;
    @IsLatitude()
    @Column({nullable: false})
    latitude: number;
    @IsLongitude()
    @Column({nullable: false})
    longitude: number;
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
