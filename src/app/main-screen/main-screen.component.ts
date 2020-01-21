import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
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

  UrlParamOffset = 0;
  UrlParamLimit = 10;
  pokemonIndexesList: PokemonList;
  pokemonFirstRow: PokemonFullData[] = [];
  pokemonSecondRow: PokemonFullData[] = [];

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
    let params = new HttpParams();
    params = params.set('offset', this.UrlParamOffset.toString());
    params = params.set('limit', this.UrlParamLimit.toString());

    return await this.http.get(this.pokemonApiUrl, { params })
      .pipe(
        tap((x: PokemonList) => this.pokemonIndexesList = x),
        catchError(this.handleError))
      .toPromise();
  }

  async loadPokemonCompleteData() {
    const pokemonFullDataList = await Promise.all(this.pokemonIndexesList.results.map(x => this.requestPokemonData(x)));

    this.pokemonFirstRow = pokemonFullDataList.slice(0, 5);
    this.pokemonSecondRow = pokemonFullDataList.slice(5);
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

  toCamelCase(str: string) {
    return str.charAt(0).toLocaleUpperCase() + str.slice(1).toLowerCase();
  }

  goToNextPage() {
    this.UrlParamOffset += 10;
    this.loadPokemonData();
  }

  goToPreviousPage() {
    if (this.UrlParamOffset !== 0) {
      this.UrlParamOffset -= 10;
    }

    this.loadPokemonData();
  }

}
