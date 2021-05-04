import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.model";

export interface ApprovalProps{
    value: number
}

@Entity({schema: "agir_pour_tous"})
export class Approval implements ApprovalProps{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable : false
    })
    value: number;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => User, user => user.approvalTarget)
    userTarget: User;

    @ManyToOne(() => User, user => user.approvalVoter)
    userVoter: User;
}
