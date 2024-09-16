
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware";
import prisma from "../models/db"; // Import the Prisma client instance

const router = express.Router();

// Mock secret for JWT (store it securely in production)
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// POST /api/login - User login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username from the database
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user: { username: user.username, name: user.name } });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/user - Get user data (Protected route)
router.get("/user", authMiddleware, async (req, res) => {
  const userId = req.user;

  try {
    // Find user by ID from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user.id,
      name: user.name,
      username: user.username,
      profileImage: user.profileImage,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

