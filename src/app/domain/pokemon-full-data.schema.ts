export class PokemonFullData {
    id: number;
    name: string;
    sprites: {
        back_default: string;
        back_female: string;
        back_shiny: string;
        back_shiny_female: string;
        front_default: string;
        front_female: string;
        front_shiny: string;
        front_shiny_female: string;
    };
    height: number;
    weight: number;
    types: [
        {
            slot: number;
            type: {
                name: string;
            }
        }
    ];
    stats: [
        {
            base_stat: number;
            effort: number;
            stat: {
                name: string;
                url: string;
            }
        }
    ];
}
