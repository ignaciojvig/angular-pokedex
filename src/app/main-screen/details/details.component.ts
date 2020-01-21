import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PokemonFullData } from 'src/app/domain/pokemon-full-data.schema';
import { isNull } from 'util';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {

  pokeImgList: string[] = [];

  constructor(
    private dialogRef: MatDialogRef<DetailsComponent>,
    @Inject(MAT_DIALOG_DATA) private data: PokemonFullData) {

    this.readyPokeImages(data);
    console.log(data);
  }

  onNoClick() {
    this.dialogRef.close();
  }

  readyPokeImages(pokemonData: PokemonFullData) {
    for (const [key, value] of Object.entries(pokemonData.sprites)) {
      if (!isNull(value)) {
        this.pokeImgList.push(value);
      }
    }
  }

  getPokemonSpecificStat(stat: string) {
    return this.data.stats.find(x => x.stat.name === stat).base_stat;
  }

  getPokemonTypeList() {
    return this.data.types.map(x => this.toCamelCase(x.type.name)).join(', ');
  }

  toCamelCase(str: string) {
    return str.charAt(0).toLocaleUpperCase() + str.slice(1).toLowerCase();
  }

}
