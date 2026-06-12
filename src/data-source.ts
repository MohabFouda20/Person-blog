import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./models/User";
import { Post } from "./models/Post";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "personal_blog_db",
    synchronize: true, // Auto-create tables (turn off in production)
    logging: false,
    entities: [User, Post],
    migrations: [],
    subscribers: [],
});
