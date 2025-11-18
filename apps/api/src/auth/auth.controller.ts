import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { prisma } from "@samuel-oak/db";
import { hashPassword, comparePassword, generateToken } from "./auth.utils";

// POST /auth/register
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  });

  const token = generateToken(user.id);
  res.status(201).json({ user: { id: user.id, email: user.email }, token });
});

// POST /auth/login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user.id);
  res.json({ user: { id: user.id, email: user.email }, token });
});
