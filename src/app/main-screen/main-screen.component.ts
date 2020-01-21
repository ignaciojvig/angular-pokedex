import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { PokemonList } from '../domain/pokemon-list.schema';
import { throwError } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { PokemonFullData } from '../domain/pokemon-full-data.schema';
import { PokemonNameAndUrl } from '../domain/pokemon-name-url.schema';
import { MatDialog } from '@angular/material/dialog';
import { DetailsComponent } from './details/details.component';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss']
})
export class MainScreenComponent implements OnInit {

  searchTypeTimeout;
  searchMode = false;

  pokemonApiUrl = 'https://pokeapi.co/api/v2/pokemon/';

  UrlParamOffset = 0;
  UrlParamLimit = 10;
  pokemonIndexesList: PokemonList;
  searchModePokemonIndexesList: PokemonList;
  pokemonFirstRow: PokemonFullData[] = [];
  pokemonSecondRow: PokemonFullData[] = [];

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private http: HttpClient,
    private dialog: MatDialog) {
    this.registerSvgIcon(iconRegistry, sanitizer);
    this.loadPokemonData();
  }

  ngOnInit() {
  }

  registerSvgIcon(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'meowth',
      sanitizer.bypassSecurityTrustResourceUrl('assets/meowth.svg'));

    iconRegistry.addSvgIcon(
      'egg',
      sanitizer.bypassSecurityTrustResourceUrl('assets/egg.svg'));
  }

  loadPokemonData() {
    this.loadPokemonBaseInfo().then(() => {
      this.loadPokemonCompleteData();
    });
  }

  searchAfterType(searchValue: string) {
    if (this.searchTypeTimeout) {
      clearTimeout(this.searchTypeTimeout);
    }

    this.searchTypeTimeout = setTimeout(async () => {

      if (searchValue === '') {
        this.UrlParamOffset = 0;
        this.searchMode = false;
        this.loadPokemonData();
        return;
      }

      let params = new HttpParams();
      params = params.set('offset', 0 + '');
      params = params.set('limit', 964 + '');

      return await this.http.get(this.pokemonApiUrl, { params })
        .pipe(
          catchError(this.handleError))
        .subscribe(
          (res: PokemonList) => {

            res.results = res.results
              .filter(x => x.name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) || x.url.includes(searchValue));
            this.UrlParamOffset = 0;
            this.searchMode = true;
            this.searchModePokemonIndexesList = res;
            this.loadPokemonData();

          }
        );
    }, 3000);
  }

  async loadPokemonBaseInfo() {

    if (this.searchMode) {
      const copiedResults = { ...this.searchModePokemonIndexesList };
      copiedResults.results = copiedResults.results.slice(this.UrlParamOffset);
      this.pokemonIndexesList = copiedResults;
      return new Promise((resolve) => { resolve(); });
    }

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
    const toBeLoadedPokemons = this.pokemonIndexesList.results.slice(0, 10);
    console.log(toBeLoadedPokemons);
    const pokemonFullDataList = await Promise.all(toBeLoadedPokemons.map(x => this.requestPokemonData(x)));

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

  openDetails(pokemon: PokemonFullData) {
    this.dialog.open(DetailsComponent, { data: pokemon, maxHeight: '90vh', maxWidth: '50vw' });
  }

  addToCapturedPokemons(pokemon: PokemonFullData) {

    let capturedPokemons = JSON.parse(localStorage.getItem('captured-pokemons')) as Array<PokemonFullData>;
    if (!capturedPokemons) {
      capturedPokemons = [];
    }

    const alreadyAdded = capturedPokemons.find(x => x.id === pokemon.id);
    if (!alreadyAdded) {
      capturedPokemons.push(pokemon);
    } else {
      capturedPokemons = capturedPokemons.filter(x => x.id !== pokemon.id);
    }

    localStorage.setItem('captured-pokemons', JSON.stringify(capturedPokemons));
  }

  checkIfItsIncluded(pokemon: PokemonFullData) {
    let capturedPokemons = JSON.parse(localStorage.getItem('captured-pokemons')) as Array<PokemonFullData>;
    if (!capturedPokemons) {
      capturedPokemons = [];
    }

    const alreadyAdded = capturedPokemons.find(x => x.id === pokemon.id);
    if (!alreadyAdded) {
      return '+';
    } else {
      return '-';
    }
  }

}
