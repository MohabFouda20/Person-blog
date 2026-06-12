import { Router, Request, Response, NextFunction } from "express";
import { getAllPosts, createPost, updatePost, deletePost } from "../controllers/postController";
import { authenticateJWT, AuthRequest } from "../middlewares/authMiddleware";
import { body, validationResult } from "express-validator";

const router = Router();

// Middleware to check validation results
const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Retrieve all blog posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: A list of posts
 *       500:
 *         description: Internal Server Error
 */
router.get("/", getAllPosts as any);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post(
    "/",
    authenticateJWT as any,
    [
        body("title").notEmpty().withMessage("Title cannot be empty"),
        body("content").notEmpty().withMessage("Content cannot be empty"),
    ],
    handleValidationErrors,
    createPost as any
);

/**
 * @swagger
 * /posts/{id}:
 *   patch:
 *     summary: Update an existing post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal Server Error
 */
router.patch(
    "/:id",
    authenticateJWT as any,
    [
        body("title").notEmpty().withMessage("Title cannot be empty"),
        body("content").notEmpty().withMessage("Content cannot be empty"),
    ],
    handleValidationErrors,
    updatePost as any
);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:id", authenticateJWT as any, deletePost as any);

export default router;
