import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {IsNotEmpty, Length} from "class-validator";
import {Project} from "./project.model";

@Entity({schema: "organization-app"})
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @IsNotEmpty()
    firstName: string;

    @Column()
    lastName: string;

    @Column({unique: true})
    username: string;

    @Column({unique: true})
    mail: string;

    @Column({ select: false })
    @Length(7, 100)
    password: string;

    @Column({nullable: false})
    isAdmin: boolean;

    @ManyToMany(() => Project, project => project.users)
    @JoinTable()
    projects: Project[];
}
