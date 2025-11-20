// import { Prisma, PrismaClient } from "@prisma/client";
// import { z } from "zod";

// declare module "@prisma/client" {
//   interface PrismaClient {
//     pokemon: Prisma.PokemonDelegate;
//     pokemonType: Prisma.PokemonTypeDelegate;
//     pokemonStat: Prisma.PokemonStatDelegate;
//   }
// }

// const globalForPokemonSync = globalThis as unknown as {
//   prismaPokemonSync?: PrismaClient;
// };

// const prisma =
//   globalForPokemonSync.prismaPokemonSync ??
//   new PrismaClient({
//     log: ["error", "warn"],
//   });

// if (process.env.NODE_ENV !== "production") {
//   globalForPokemonSync.prismaPokemonSync = prisma;
// }

// const LIST_API = "https://pokeapi.co/api/v2/pokemon";
// const DEFAULT_LIMIT = Number(process.env.POKEMON_SYNC_LIMIT ?? 1300);
// const DEFAULT_CONCURRENCY = Number(process.env.POKEMON_SYNC_CONCURRENCY ?? 10);
// const DEFAULT_MAX_RETRIES = Number(process.env.POKEMON_SYNC_MAX_RETRIES ?? 3);

// const pokemonListSchema = z.object({
//   results: z.array(
//     z.object({
//       name: z.string(),
//       url: z.string().url(),
//     })
//   ),
// });

// const pokemonDetailSchema = z.object({
//   id: z.number().int().positive(),
//   name: z.string(),
//   height: z.number().int().nullable(),
//   weight: z.number().int().nullable(),
//   sprites: z.object({
//     front_default: z.string().url().nullable(),
//   }),
//   types: z.array(
//     z.object({
//       slot: z.number().int(),
//       type: z.object({
//         name: z.string(),
//       }),
//     })
//   ),
//   stats: z.array(
//     z.object({
//       base_stat: z.number().int(),
//       effort: z.number().int(),
//       stat: z.object({
//         name: z.string(),
//       }),
//     })
//   ),
// });

// type PokemonDetail = z.infer<typeof pokemonDetailSchema>;
// type PokemonSummary = z.infer<typeof pokemonListSchema>["results"][number];

// type SyncOptions = {
//   limit?: number;
//   concurrency?: number;
//   maxRetries?: number;
// };

// export async function syncPokemons(options: SyncOptions = {}) {
//   const fetcher = getFetch();
//   const limit = options.limit ?? DEFAULT_LIMIT;
//   const concurrency = Math.max(1, options.concurrency ?? DEFAULT_CONCURRENCY);
//   const maxRetries = Math.max(0, options.maxRetries ?? DEFAULT_MAX_RETRIES);

//   const listUrl = new URL(LIST_API);
//   listUrl.searchParams.set("limit", limit.toString());

//   console.log(`Fetching Pokémon list (limit=${limit})…`);
//   const listJson = pokemonListSchema.parse(await fetchJson(listUrl.toString(), fetcher, maxRetries));
//   const total = listJson.results.length;

//   if (total === 0) {
//     console.warn("Pokémon list is empty; nothing to sync.");
//     return;
//   }

//   console.log(`Fetched ${total} Pokémon. Syncing with concurrency=${concurrency}…`);

//   let processed = 0;
//   let succeeded = 0;
//   const failures: { name: string; reason: unknown }[] = [];

//   for (const batch of chunk(listJson.results, concurrency)) {
//     const outcomes = await Promise.allSettled(
//       batch.map((summary) => syncSinglePokemon(summary, fetcher, maxRetries))
//     );

//     outcomes.forEach((outcome, idx) => {
//       processed += 1;
//       const pokemonName = batch[idx]?.name ?? "unknown";

//       if (outcome.status === "fulfilled") {
//         succeeded += 1;
//         console.log(`[${processed}/${total}] Synced ${pokemonName}`);
//       } else {
//         failures.push({ name: pokemonName, reason: outcome.reason });
//         console.error(
//           `[${processed}/${total}] Failed to sync ${pokemonName}`,
//           outcome.reason instanceof Error ? outcome.reason.message : outcome.reason
//         );
//       }
//     });
//   }

//   if (failures.length > 0) {
//     throw new Error(`Pokémon sync finished with ${failures.length} failures. Check logs for details.`);
//   }

//   console.log(`Sync complete: ${succeeded}/${total} Pokémon upserted.`);
// }

// async function syncSinglePokemon(
//   summary: PokemonSummary,
//   fetcher: typeof globalThis.fetch,
//   maxRetries: number
// ) {
//   const detailJson = await fetchJson(summary.url, fetcher, maxRetries);
//   const data = pokemonDetailSchema.parse(detailJson);

//   const operations: Prisma.PrismaPromise<unknown>[] = [
//     prisma.pokemon.upsert({
//       where: { id: data.id },
//       create: mapPokemonCore(data),
//       update: mapPokemonCore(data),
//     }),
//     prisma.pokemonType.deleteMany({ where: { pokemonId: data.id } }),
//     prisma.pokemonStat.deleteMany({ where: { pokemonId: data.id } }),
//   ];

//   const typeData = data.types.map((type) => ({
//     pokemonId: data.id,
//     slot: type.slot,
//     name: type.type.name,
//   }));

//   if (typeData.length > 0) {
//     operations.push(prisma.pokemonType.createMany({ data: typeData }));
//   }

//   const statData = data.stats.map((stat) => ({
//     pokemonId: data.id,
//     name: stat.stat.name,
//     base: stat.base_stat,
//     effort: stat.effort,
//   }));

//   if (statData.length > 0) {
//     operations.push(prisma.pokemonStat.createMany({ data: statData }));
//   }

//   await prisma.$transaction(operations);
// }

// async function fetchJson<T>(
//   url: string,
//   fetcher: typeof globalThis.fetch,
//   maxRetries: number
// ): Promise<T> {
//   let attempt = 0;
//   let lastError: unknown;

//   while (attempt <= maxRetries) {
//     try {
//       const response = await fetcher(url);
//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status} ${response.statusText}`);
//       }
//       return (await response.json()) as T;
//     } catch (error) {
//       lastError = error;
//       attempt += 1;

//       if (attempt > maxRetries) {
//         break;
//       }

//       const delay = 250 * attempt;
//       await sleep(delay);
//     }
//   }

//   throw lastError ?? new Error(`Failed to fetch ${url}`);
// }

// function getFetch(): typeof globalThis.fetch {
//   if (typeof globalThis.fetch === "function") {
//     return globalThis.fetch.bind(globalThis);
//   }

//   throw new Error(
//     "Global fetch is not available. Please upgrade to Node.js 18+ or provide a fetch polyfill."
//   );
// }

// function mapPokemonCore(data: PokemonDetail) {
//   return {
//     id: data.id,
//     name: data.name,
//     height: data.height ?? undefined,
//     weight: data.weight ?? undefined,
//     sprite: data.sprites.front_default ?? undefined,
//   };
// }

// function chunk<T>(items: T[], size: number): T[][] {
//   const result: T[][] = [];
//   for (let i = 0; i < items.length; i += size) {
//     result.push(items.slice(i, i + size));
//   }
//   return result;
// }

// function sleep(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }


