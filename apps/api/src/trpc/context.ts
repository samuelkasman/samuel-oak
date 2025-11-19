import type { IncomingMessage, ServerResponse } from "http";
import { prisma } from "@samuel-oak/db";

/**
 * createContext is called for each request to build the context object.
 * Keep it async so you can await DB calls (e.g. loading user by token).
 */
export async function createContext({ req, res }: { req: IncomingMessage & { user?: any }, res: ServerResponse }) {
  // req.user may be set by earlier JWT middleware. If not present, you could load it here.
  const user = (req as any).user ?? null;

  // Optionally, you could re-fetch fresh user from DB:
  // const currentUser = user ? await prisma.user.findUnique({ where: { id: user.userId } }) : null;

  return {
    req,
    res,
    user,
    prisma, // pass prisma so resolvers can use it via ctx.prisma
  };
}

// Modern, robust way to infer the context type:
export type Context = Awaited<ReturnType<typeof createContext>>;
