import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255 })
    title!: string;

    @Column({ type: "text" })
    content!: string;

    @CreateDateColumn()
    created_at!: Date;

    @ManyToOne(() => User, user => user.posts, { onDelete: "CASCADE" })
    author!: User;
}
