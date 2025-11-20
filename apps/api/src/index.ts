import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { protect } from "./auth/auth.middleware";
import { prisma } from "@samuel-oak/db";
import jwt from "jsonwebtoken";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc/appRouter";
import { createContext } from "./trpc/context";
import { apiEnv } from "./config/env";
import { AUTH_COOKIE_NAME } from "./auth/auth.utils";

const app = express();
app.use(
  cors({
    origin: apiEnv.corsOrigin,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// JWT middleware
app.use((req, _, next) => {
  const auth = req.headers.authorization;
  let token: string | null = null;

  if (auth?.startsWith("Bearer ")) {
    token = auth.substring(7);
  } else if (req.cookies?.[AUTH_COOKIE_NAME]) {
    token = req.cookies[AUTH_COOKIE_NAME];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, apiEnv.jwtSecret);
      (req as any).user = decoded;
    } catch {
      // ignore invalid token; downstream auth will reject
    }
  }
  next();
});

// REST endpoints
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
