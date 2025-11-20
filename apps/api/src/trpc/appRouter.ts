import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  comparePassword,
  generateToken,
  hashPassword,
  setAuthCookie,
  clearAuthCookie,
} from "../auth/auth.utils";
import { router, publicProcedure, protectedProcedure } from "./trpc";

const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User already exists",
        });
      }

      const hashedPassword = await hashPassword(input.password);
      const user = await ctx.prisma.user.create({
        data: { email: input.email, password: hashedPassword },
      });

      const token = generateToken(user.id);
      setAuthCookie(ctx.res, token);

      return {
        user: { id: user.id, email: user.email },
        token,
      };
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        });
      }

      const isMatch = await comparePassword(input.password, user.password);

      if (!isMatch) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        });
      }

      const token = generateToken(user.id);
      setAuthCookie(ctx.res, token);

      return {
        user: { id: user.id, email: user.email },
        token,
      };
    }),

  logout: protectedProcedure.mutation(({ ctx }) => {
    clearAuthCookie(ctx.res);
    return { success: true };
  }),
});

export const appRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return { message: `Hello ${input?.name ?? "stranger"}` };
    }),

  auth: authRouter,

  me: protectedProcedure.query(({ ctx }) => {
    return ctx.user; // user from JWT!
  }),

  getUsers: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),
});

export type AppRouter = typeof appRouter;
