import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PokemonList } from '../domain/pokemon-list.schema';
import { throwError } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { PokemonFullData } from '../domain/pokemon-full-data.schema';
import { PokemonNameAndUrl } from '../domain/pokemon-name-url.schema';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss']
})
export class MainScreenComponent implements OnInit {

  pokemonApiUrl = 'https://pokeapi.co/api/v2/pokemon/';
  pokemonApiUrlParams = '?offset=0&limit=10';
  pokemonIndexesList: PokemonList;
  pokemonFullDataList: PokemonFullData[] = [];

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private http: HttpClient) {
    this.registerSvgIcon(iconRegistry, sanitizer);
    this.loadPokemonData();
  }

  ngOnInit() {
  }

  registerSvgIcon(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'meowth',
      sanitizer.bypassSecurityTrustResourceUrl('assets/meowth.svg'));
  }

  loadPokemonData() {
    this.loadPokemonBaseInfo().then(() => {
      this.loadPokemonCompleteData();
    });
  }

  async loadPokemonBaseInfo() {
    return await this.http.get(this.pokemonApiUrl + this.pokemonApiUrlParams)
      .pipe(
        tap((x: PokemonList) => this.pokemonIndexesList = x),
        catchError(this.handleError))
      .toPromise();
  }

  async loadPokemonCompleteData() {
    this.pokemonFullDataList = await Promise.all(this.pokemonIndexesList.results.map(x => this.requestPokemonData(x)));
    console.log(this.pokemonFullDataList);
  }

  requestPokemonData(x: PokemonNameAndUrl): Promise<PokemonFullData> {
    return new Promise(
      resolve => {
        this.http.get(this.pokemonApiUrl + x.name).subscribe((y: PokemonFullData) => resolve(y));
      }
    );
  }

  handleError(err: HttpErrorResponse) {
    let errorMessage = '';

    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }

    console.error(errorMessage);
    return throwError(errorMessage);
  }

  camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

}
