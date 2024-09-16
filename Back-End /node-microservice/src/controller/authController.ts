
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../models/db";
import dotenv from "dotenv";
import { Gender,Role } from "@prisma/client";

dotenv.config();

interface RegisterRequestBody {
  email: string;
  username: string;
  password: string;
  gender: Gender;
  phoneNumber?: string;
  role?: Role; 
}

const register = async (
  req: Request<{}, {}, RegisterRequestBody>,
  res: Response
): Promise<void> => {
  const { email, username, password, gender, phoneNumber,role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        gender,
        phoneNumber: phoneNumber || null,
        role:role|| 'USER',
      },
    });
    
  // Respond with the created user details (or filter sensitive info like the password)
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
 }
catch (error: any) {
  if (error.code === "P2002") {
    // Handle unique constraint violation (duplicate email, username, or phone number)
    const fields = error.meta.target; // Access all fields that caused the violation

    // Map the unique constraint violation to the appropriate fields
    const errorMessages = fields.map((field: string) => {
      if (field === "email") return { field: "email", message: "Email already exists." };
      if (field === "username") return { field: "username", message: "Username already exists." };
      if (field === "phoneNumber") return { field: "phoneNumber", message: "Phone number already exists." };
      return null;
    }).filter(Boolean); // Remove any null values from the array

    // Send all errors to the client
    res.status(400).json({ errors: errorMessages });
  } else {
    // Handle other errors
    console.error("User Creation Error:", error);
    res.status(500).json({ error: "User registration failed." });
  }
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
  
    // Generate a JWT token
    const token = jwt.sign(
      { userId: user.id, roles: user.role  }, // Assuming 'role' exists on your user model
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    // Send the token to the client
    res.status(200).json({
      message: "Login successful.",
      token, // Include the token in the response
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
};export { register, login };

