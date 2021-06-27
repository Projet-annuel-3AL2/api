import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Event} from "./event.model";

export interface CategoryProps {
    name: string;
}

@Entity()
export class Category {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column()
    name: string;
    @OneToMany(() => Event, event => event.category)
    events: Event[];
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date;
}
