import express from "express";
import cors from "cors";
import authRoutes from "./auth/auth.routes";
import { protect } from "./auth/auth.middleware";
import { prisma } from "@samuel-oak/db";

const app = express();
app.use(cors());
app.use(express.json());

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

const PORT = 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
