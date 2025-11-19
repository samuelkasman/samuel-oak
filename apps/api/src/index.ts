import express from "express";
import cors from "cors";
import authRoutes from "./auth/auth.routes";
import { protect } from "./auth/auth.middleware";
import { prisma } from "@samuel-oak/db";
import jwt from "jsonwebtoken";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc/appRouter";
import { createContext } from "./trpc/context";
import { apiEnv } from "./config/env";

const app = express();
app.use(
  cors({
    origin: apiEnv.corsOrigin,
    credentials: true,
  })
);
app.use(express.json());

// JWT middleware
app.use((req, _, next) => {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) {
    const token = auth.substring(7);
    try {
      const decoded = jwt.verify(token, apiEnv.jwtSecret);
      (req as any).user = decoded;
    } catch {}
  }
  next();
});

// REST endpoints
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello from Samuel Oak API!");
});

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Example protected route
app.get("/protected", protect, (req, res) => {
  res.json({ message: "You are authorized!", user: (req as any).user });
});

// tRPC
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

const PORT = apiEnv.port;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
