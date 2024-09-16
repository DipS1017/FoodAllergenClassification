
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    console.log('No token found');
    return res.status(403).json({ message: "Access denied." });
  }

  try {
    const secret = process.env.JWT_SECRET as string; // Ensure secret is defined
    const decoded = jwt.verify(token, secret) as JwtPayload;
    console.log('Decoded userId:', decoded.userId);
    req.user = decoded.userId; // Make sure req.user is properly typed
    next();
  } catch (error) {
    console.log('Token verification failed:', error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired." });
    }
    return res.status(400).json({ message: "Invalid token." });
  }
};

export default authMiddleware;

