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
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
