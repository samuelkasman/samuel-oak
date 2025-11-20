import type { IncomingMessage, ServerResponse } from "http";
import { prisma } from "@samuel-oak/db";
import type { CookieCapableResponse } from "../auth/auth.utils";

type TrpcRequest = IncomingMessage & { user?: any };
type TrpcResponse = ServerResponse & CookieCapableResponse;

export async function createContext({ req, res }: { req: TrpcRequest; res: TrpcResponse }) {
  const user = (req as any).user ?? null;

  return {
    req,
    res,
    user,
    prisma,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
