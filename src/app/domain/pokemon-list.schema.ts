import { PokemonNameAndUrl } from './pokemon-name-url.schema';

export class PokemonList {
    count: number;
    next: string;
    previous: string;
    results: PokemonNameAndUrl[];
}

