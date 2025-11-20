import { createTRPCRouter, protectedProcedure } from "../trpc/trpc";
// import { syncPokemons } from "../services/pokemonSync";

export const adminRouter = createTRPCRouter({
  syncPokemons: protectedProcedure.mutation(async () => {
    // await syncPokemons();
    return { ok: true };
  }),
});


