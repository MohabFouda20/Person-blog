import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    userId?: number;
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        const jwtSecret = process.env.JWT_SECRET || "default_secret";

        jwt.verify(token, jwtSecret, (err, user: any) => {
            if (err) {
                res.status(401).json({ error: "Unauthorized: Invalid token" });
                return;
            }
            req.userId = user.userId;
            next();
        });
    } else {
        res.status(401).json({ error: "Unauthorized: Token missing" });
    }
};
