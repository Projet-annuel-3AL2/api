import {ISession} from "connect-typeorm";
import {Column, Entity, Index, ManyToOne, PrimaryColumn} from "typeorm";
import {User} from "./user.model";

@Entity()
export class Session implements ISession {
    @Index()
    @Column("bigint")
    public expiredAt = Date.now();

    @PrimaryColumn("varchar", {length: 255})
    public id = "";

    @Column("text")
    public json = "";

    @ManyToOne(()=>User,user=>user.sessions, {onDelete:"CASCADE"})
    user:User;
}
