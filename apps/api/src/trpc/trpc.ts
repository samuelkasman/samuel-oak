import { initTRPC } from "@trpc/server";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * protectedProcedure middleware example:
 * It throws an error if ctx.user is not present.
 * You can refine to check roles, permissions, etc.
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new Error("UNAUTHORIZED");
  }
  return next({
    ctx: {
      // ensure downstream resolvers have correct typing for ctx.user
      user: ctx.user,
    },
  });
});
