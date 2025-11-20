import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc/trpc";
import { authRouter } from "./auth";
// import { pokemonRouter } from "./pokemon";
import { adminRouter } from "./admin";

export const appRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return { message: `Hello ${input?.name ?? "stranger"}` };
    }),

  auth: authRouter,

  me: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.user?.userId;
    if (!userId) {
      return null;
    }

    const user = await ctx.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
      },
    });

    return user;
  }),

  getUsers: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),

  // pokemon: pokemonRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;


