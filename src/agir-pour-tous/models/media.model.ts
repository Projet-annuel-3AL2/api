import {Organisation} from "./organisation.model";
import {Post} from "./post.model";
import {User} from "./user.model";
import {
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Comment} from "./comment.model";

@Entity()
export class Media {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @OneToOne(() => User, user => user.profilePicture)
    userProfilePicture: User;
    @OneToOne(() => User, user => user.bannerPicture)
    userBanner: User;
    @ManyToOne(() => Post, post => post.medias)
    post: Post[];
    @OneToOne(() => Organisation, organisation => organisation.profilePicture)
    organisationProfilePicture: Organisation;
    @OneToOne(() => Organisation, organisation => organisation.bannerPicture)
    organisationBannerPicture: Organisation;
    @ManyToOne(() => Comment, comment => comment.medias)
    comments: Comment[];
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
