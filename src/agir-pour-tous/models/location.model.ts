import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.model";

export interface LocationProps{
    location: string,
    livingPlace: boolean,
    range: number
}

@Entity({schema: "agir_pour_tous"})
export class Location implements LocationProps{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: false,
        default: false
    })
    livingPlace: boolean;

    @Column({
        nullable: false
    })
    location: string;

    @Column({
        nullable: false,
        default: -1
    })
    range: number;

    @ManyToOne(() => User, user => user.locations)
    users: User[];


}
