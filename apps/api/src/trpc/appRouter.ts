import { router, publicProcedure, protectedProcedure } from "./trpc";
import { z } from "zod";
import { prisma } from "@samuel-oak/db";

export const appRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return { message: `Hello ${input?.name ?? "stranger"}` };
    }),

  me: protectedProcedure.query(({ ctx }) => {
    return ctx.user; // user from JWT!
  }),

  getUsers: protectedProcedure.query(async () => {
    return prisma.user.findMany();
  }),
});

export type AppRouter = typeof appRouter;
