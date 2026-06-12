import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../models/User";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        const userRepository = AppDataSource.getRepository(User);
        
        // Check if user already exists
        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({ error: "Email is already in use." });
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = userRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        await userRepository.save(newUser);

        res.status(201).json({ message: "User registered successfully.", userId: newUser.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const userRepository = AppDataSource.getRepository(User);

        // Find user
        const user = await userRepository.findOne({ where: { email } });
        if (!user) {
            res.status(401).json({ error: "Invalid email or password." });
            return;
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ error: "Invalid email or password." });
            return;
        }

        // Generate JWT
        const jwtSecret = process.env.JWT_SECRET || "default_secret";
        const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: "1h" });

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
