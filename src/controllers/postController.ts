import { Response } from "express";
import { AppDataSource } from "../data-source";
import { Post } from "../models/Post";
import { User } from "../models/User";
import { AuthRequest } from "../middlewares/authMiddleware";

const postRepository = AppDataSource.getRepository(Post);
const userRepository = AppDataSource.getRepository(User);

export const getAllPosts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const posts = await postRepository.find({
            relations: {
                author: true
            },
            select: {
                author: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        });
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, content } = req.body;
        const userId = req.userId;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const user = await userRepository.findOne({ where: { id: userId } });
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const newPost = postRepository.create({
            title,
            content,
            author: user
        });

        await postRepository.save(newPost);
        res.status(201).json({ message: "Post created successfully.", post: newPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updatePost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const postId = parseInt(req.params.id as string);
        const { title, content } = req.body;
        const userId = req.userId;

        const post = await postRepository.findOne({ 
            where: { id: postId },
            relations: {
                author: true
            }
        });

        if (!post) {
            res.status(404).json({ error: "Post not found" });
            return;
        }

        if (post.author.id !== userId) {
            res.status(401).json({ error: "Unauthorized: You can only update your own posts." });
            return;
        }

        post.title = title || post.title;
        post.content = content || post.content;

        await postRepository.save(post);
        res.status(200).json({ message: "Post updated successfully.", post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const postId = parseInt(req.params.id as string);
        const userId = req.userId;

        const post = await postRepository.findOne({ 
            where: { id: postId },
            relations: {
                author: true
            }
        });

        if (!post) {
            res.status(404).json({ error: "Post not found" });
            return;
        }

        if (post.author.id !== userId) {
            res.status(401).json({ error: "Unauthorized: You can only delete your own posts." });
            return;
        }

        await postRepository.remove(post);
        res.status(200).json({ message: "Post deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
