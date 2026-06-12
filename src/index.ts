import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import authRoutes from "./routes/authRoutes";
import { setupSwagger } from "./swagger";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Mount the Auth routes
app.use("/auth", authRoutes);

// Setup Swagger UI
setupSwagger(app);

// Base route
app.get("/", (req, res) => {
    res.send("Welcome to the Personal Blogging Platform API");
});

// Initialize TypeORM and start server
AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });
