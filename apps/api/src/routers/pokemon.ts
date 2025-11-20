import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc/trpc";

// export const pokemonRouter = createTRPCRouter({
//   all: publicProcedure.query(async ({ ctx }) => {
//     return ctx.prisma.pokemon.findMany({
//       include: { types: true, stats: true },
//       orderBy: { id: "asc" },
//     });
//   }),

//   byId: publicProcedure
//     .input(z.object({ id: z.number() }))
//     .query(async ({ ctx, input }) => {
//       return ctx.prisma.pokemon.findUnique({
//         where: { id: input.id },
//         include: { types: true, stats: true },
//       });
//     }),
// });


