import {Post} from "./post.model";
import {User} from "./user.model";
import {Organisation} from "./organisation.model";
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Category} from "./category.model";
import {Report} from "./report.model";
import {IsDate, IsDefined, IsLatitude, IsLongitude, IsNotEmpty, IsOptional, Length, MaxLength} from "class-validator";
import {Media} from "./media.model";

export interface EventProps {
    id?: string;
    name: string;
    startDate: Date;
    endDate: Date;
    latitude: number;
    longitude: number;
    organisation?: Organisation;
    user: User;
    picture?: Media;
}

@Entity()
export class Event {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Length(5, 50)
    @Column({nullable: false, length: 50})
    name: string;
    @IsOptional()
    @MaxLength(200)
    @Column({nullable: false, length: 200})
    description: string;
    @IsDate()
    @IsDefined()
    @Column({nullable: false})
    startDate: Date;
    @IsDate()
    @IsDefined()
    @Column({nullable: false})
    endDate: Date;
    @IsLatitude()
    @Column({type: "float", nullable: false})
    latitude: number;
    @IsLongitude()
    @Column({type: "float", nullable: false})
    longitude: number;
    @Column({nullable: false, default: -1})
    participantsLimit: number;
    @ManyToOne(() => Organisation, organisation => organisation.events)
    organisation: Organisation;
    @ManyToOne(() => User, user => user.createdEvents)
    user: User;
    @ManyToMany(() => User, user => user.eventsParticipation)
    participants: User[];
    @OneToMany(() => Post, post => post.sharedEvent)
    posts: Post[];
    @IsNotEmpty()
    @ManyToOne(() => Category, category => category.events, {nullable: false, eager: true})
    category: Category;
    @OneToOne(() => Media, media => media.eventPicture, {nullable: true, cascade: true, eager: true})
    @JoinColumn()
    picture: Media;
    @OneToMany(() => Report, report => report.reportedEvent, {cascade: true})
    reported: Report[];
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
