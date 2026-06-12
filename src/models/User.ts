import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, Relation } from "typeorm";
import type { Post } from "./Post";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 100 })
    name!: string;

    @Column({ type: "varchar", length: 100, unique: true })
    email!: string;

    @Column({ type: "varchar" })
    password!: string;

    @CreateDateColumn()
    created_at!: Date;

    @OneToMany("Post", "author")
    posts!: Relation<Post[]>;
}
