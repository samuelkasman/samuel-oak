import { trpc } from "@/lib/trpc";

// type PokemonListItem = Awaited<ReturnType<typeof trpc.pokemon.all.query>>[number];

export default async function PokemonPage() {
  // const pokemons = await trpc.pokemon.all.query();

  return (
    <div className="p-4">
      <h1>Pokédex</h1>
      {/* <ul>
        {pokemons.map((pokemon: PokemonListItem) => (
          <li key={pokemon.id}>
            #{pokemon.id} {pokemon.name}
          </li>
        ))}
      </ul> */}
    </div>
  );
}


