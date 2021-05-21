import {Post} from "./post.model";
import {User} from "./user.model";
import {
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Report} from "./report.model";

@Entity()
export class Group {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @ManyToMany(() => User, user => user.administratedGroups)
    admins: User[];
    @ManyToMany(() => User, user => user.groups)
    users: User[];
    @OneToMany(() => Post, post => post.group)
    posts: Post[];
    @OneToMany(() => Report, report => report.reportedGroup)
    reported: Report[];
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
