import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().optional(),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  CORS_ORIGIN: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid API environment configuration:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid API environment configuration");
}

const env = parsed.data;

export const apiEnv = {
  nodeEnv: env.NODE_ENV,
  port: env.PORT ?? 4000,
  jwtSecret: env.JWT_SECRET,
  corsOrigin: env.CORS_ORIGIN ?? "http://localhost:3000",
};

