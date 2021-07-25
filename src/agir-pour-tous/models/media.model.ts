import {Organisation} from "./organisation.model";
import {Post} from "./post.model";
import {User} from "./user.model";
import {
    BeforeRemove,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Comment} from "./comment.model";
import {Event} from "./event.model";
import fs from "fs";

@Entity()
export class Media {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column({nullable: false})
    link: string;
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
    @OneToOne(() => Event, event => event.picture)
    eventPicture: Media;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;

    @BeforeRemove()
    deleteFile(){
        fs.unlinkSync(process.env.FILE_UPLOADS_PATH + '/' +this.link);
    }
}
