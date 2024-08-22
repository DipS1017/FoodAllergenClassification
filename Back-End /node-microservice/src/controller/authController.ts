
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../models/db";
import dotenv from "dotenv";
import { Gender } from "@prisma/client";

dotenv.config();

interface RegisterRequestBody {
  email: string;
  username: string;
  password: string;
  gender: Gender;
  phoneNumber?: string;
}

const register = async (
  req: Request<{}, {}, RegisterRequestBody>,
  res: Response
): Promise<void> => {
  const { email, username, password, gender, phoneNumber } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        gender,
        phoneNumber: phoneNumber || null,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    console.error("User Creation Error:", error);
    res.status(500).json({ error: "User Creation Failed" });
  }
};

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
    res.status(200).json({ token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Login Failed" });
  }
};

export { register, login };

