import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.model";

@Entity({schema: "organization-app"})
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false, unique: true})
    name: string;

    @ManyToMany(() => User, user => user.projectsMember)
    usersMember: User[];

    @ManyToMany(()=> User, user =>user.projectsAdmin)
    usersAdmin: User[];
}
