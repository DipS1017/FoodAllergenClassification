
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware";
import prisma from "../models/db"; // Import the Prisma client instance

const router = express.Router();

// Mock secret for JWT (store it securely in production)
const JWT_SECRET = process.env.JWT_SECRET ; 

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

    res.json({ token, user: { username: user.username, } });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/user/profile - Get user profile data (Protected route)
router.get('/user/profile', authMiddleware, async (req, res) => {
  const userId = req.user; // User ID from the token

  try {
    // Fetch user from the database using Prisma
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send user profile data
    res.json({
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
    });
  } catch (error) {
    console.error('Error fetching user profile data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/user/profile - Update user profile data (Protected route)
router.put('/user/profile', authMiddleware, async (req, res) => {
  const userId = req.user; // User ID from the token
  const { name, username, email, phoneNumber, gender, profileImage } = req.body;

  try {
    // Find and update user profile using Prisma
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        email,
        phoneNumber,
        gender,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send updated user profile data
    res.json({
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
    });
  } catch (error) {
    console.error('Error updating user profile data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
;
