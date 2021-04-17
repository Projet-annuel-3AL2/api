import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.model";
import {config} from "dotenv";

@Entity({schema: "organization-app"})
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false, unique: true})
    name: string;

    @ManyToMany(() => User, user => user.projects)
    @JoinTable()
    users: User[];
}
