import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.model";

@Entity({schema: process.env.DB_SCHEMA_OA})
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false, unique: true})
    name: string;

    @ManyToMany(() => User)
    @JoinTable()
    users: User[];

}
