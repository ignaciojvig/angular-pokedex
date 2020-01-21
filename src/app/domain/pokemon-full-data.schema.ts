export class PokemonFullData {
    id: number;
    name: string;
    sprites: { front_default: string; };
    types: [
        {
            slot: number;
            type: {
                name: string;
            }
        }
    ];
}
