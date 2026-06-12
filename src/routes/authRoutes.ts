import { Router, Request, Response, NextFunction } from "express";
import { register, login } from "../controllers/authController";
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
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or Email already in use
 *       500:
 *         description: Internal Server Error
 */
// Registration route
router.post(
    "/register",
    [
        body("name").notEmpty().withMessage("Name is required"),
        body("email").isEmail().withMessage("Must be a valid email address"),
        body("password")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long"),
    ],
    handleValidationErrors,
    register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns a JWT token
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal Server Error
 */
// Login route
router.post(
    "/login",
    [
        body("email").isEmail().withMessage("Must be a valid email address"),
        body("password").notEmpty().withMessage("Password is required"),
    ],
    handleValidationErrors,
    login
);

export default router;
