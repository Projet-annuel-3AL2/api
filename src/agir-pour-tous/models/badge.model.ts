import {Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.model";
import {JoinTable} from "typeorm/browser";

export interface BadgeProps{
    name: string,
    description: string;
    pictureURL: string
}

@Entity({schema: "agir_pour_tous"})
export class Badge implements BadgeProps{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false, unique: true})
    name: string;

    @Column()
    description: string;

    @Column()
    pictureURL: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToMany(() => User, user => user.badges)
    users: User[];
}
