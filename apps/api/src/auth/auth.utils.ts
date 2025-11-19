import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { apiEnv } from "../config/env";

const JWT_SECRET = apiEnv.jwtSecret;
const JWT_EXPIRES_IN = "1h"; // token expiration

// Hash password
export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

// Compare password
export async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

// Generate JWT
export function generateToken(userId: number) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify JWT
export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { userId: number };
}
