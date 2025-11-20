import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { apiEnv } from "../config/env";

const JWT_SECRET = apiEnv.jwtSecret;
const JWT_EXPIRES_IN = "1h"; // token expiration
export const AUTH_COOKIE_NAME = "samuel_oak_token";
const AUTH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export type CookieOptionsLite = {
  httpOnly?: boolean;
  sameSite?: "lax" | "strict" | "none";
  secure?: boolean;
  path?: string;
  maxAge?: number;
};

export type CookieCapableResponse = {
  cookie?: (name: string, value: string, options?: CookieOptionsLite) => void;
  clearCookie?: (name: string, options?: CookieOptionsLite) => void;
};

const authCookieOptions: CookieOptionsLite = {
  httpOnly: true,
  sameSite: "lax",
  secure: apiEnv.nodeEnv === "production",
  path: "/",
  maxAge: AUTH_COOKIE_MAX_AGE_MS,
};

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

export function setAuthCookie(res: CookieCapableResponse, token: string) {
  res.cookie?.(AUTH_COOKIE_NAME, token, authCookieOptions);
}

export function clearAuthCookie(res: CookieCapableResponse) {
  res.clearCookie?.(AUTH_COOKIE_NAME, authCookieOptions);
}
