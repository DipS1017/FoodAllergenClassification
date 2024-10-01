
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../models/db"; // Ensure this is pointing to your Prisma client instance
import dotenv from "dotenv";
import { Gender, Role } from "@prisma/client";
import crypto from "crypto";
import nodemailer from "nodemailer"; // Import Nodemailer

dotenv.config();

interface RegisterRequestBody {
  email: string;
  username: string;
  password: string;
  gender: Gender;
  phoneNumber?: string;
  role?: Role;
}

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // e.g., smtp.gmail.com
  port: Number(process.env.EMAIL_PORT), // 587 for Gmail
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

// User Registration
const register = async (
  req: Request<{}, {}, RegisterRequestBody>,
  res: Response
): Promise<void> => {
  const { email, username, password, gender, phoneNumber, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        gender,
        phoneNumber: phoneNumber || null,
        role: role || "USER",
      },
    });

    res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        gender: user.gender,
        role: user.role,
      },
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      const fields = error.meta.target;

      const errorMessages = fields
        .map((field: string) => {
          if (field === "email") return { field: "email", message: "Email already exists." };
          if (field === "username") return { field: "username", message: "Username already exists." };
          if (field === "phoneNumber") return { field: "phoneNumber", message: "Phone number already exists." };
          return null;
        })
        .filter(Boolean);

      res.status(400).json({ errors: errorMessages });
    } else {
      console.error("User Creation Error:", error);
      res.status(500).json({ error: "User registration failed." });
    }
  }
};

// User Login
const login = async (
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, roles: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        gender: user.gender,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Login failed." });
  }
};

// Forgot Password (Request Password Reset)
const forgotPassword = async (
  req: Request<{}, {}, { email: string }>,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      res.status(400).json({ error: "No account with that email found." });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiration

    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt: resetTokenExpiry,
      },
    });

    // Send reset email using Nodemailer
    const mailOptions = {
      from: process.env.EMAIL_USER, // Your email address
      to: email,
      subject: "Password Reset",
      text: `You requested a password reset. Click the link to reset your password: ${process.env.CLIENT_URL}/reset-password/${resetToken}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset link sent!" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ error: "Failed to send password reset email." });
  }
};

// Reset Password (Handle New Password Submission)
const resetPassword = async (
  req: Request<{ token: string }, {}, { password: string }>,
  res: Response
): Promise<void> => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const passwordResetEntry = await prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!passwordResetEntry || passwordResetEntry.expiresAt < new Date()) {
      res.status(400).json({ error: "Invalid or expired reset token." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: passwordResetEntry.userId },
      data: {
        password: hashedPassword,
      },
    });

    await prisma.passwordReset.delete({
      where: { id: passwordResetEntry.id },
    });

    res.status(200).json({ message: "Password reset successful!" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ error: "Password reset failed." });
  }
};

export { register, login, forgotPassword, resetPassword };
