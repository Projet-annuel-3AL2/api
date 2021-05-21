import {CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Event} from "./event.model";

@Entity()
export class Category {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @OneToMany(() => Event, event => event.category)
    events: Event[];
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
