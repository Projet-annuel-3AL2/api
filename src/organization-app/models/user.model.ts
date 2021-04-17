import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {IsNotEmpty, Length} from "class-validator";

@Entity({schema: process.env.DB_SCHEMA_OA})
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @IsNotEmpty()
    firstName: string;

    @Column()
    lastName: string;

    @Column({unique:true})
    username: string;

    @Column({unique:true})
    mail: string;

    @Column()
    @Length(7,100)
    password: string;

    @Column({nullable:false})
    isAdmin: boolean;
}
