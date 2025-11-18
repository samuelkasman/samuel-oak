import express from "express";
import cors from "cors";
import { prisma } from "@samuel-oak/db";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Samuel Oak API!");
});

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

const PORT = 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
