import { Component, OnInit, Inject } from '@angular/core';
import { PokemonFullData } from '../domain/pokemon-full-data.schema';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {

  myCollectionOfPokemons: PokemonFullData[];

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.loadPokemons();
  }

  toCamelCase(str: string) {
    return str.charAt(0).toLocaleUpperCase() + str.slice(1).toLowerCase();
  }

  removeFromCollectionDialog(pokemon: PokemonFullData) {
    const dialogRef = this.dialog.open(RemoveFromCollectionConfirmationDialogComponent, {
      data: pokemon
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadPokemons();
    });
  }

  loadPokemons() {
    this.myCollectionOfPokemons = JSON.parse(localStorage.getItem('captured-pokemons')) as Array<PokemonFullData>;
    console.log(this.myCollectionOfPokemons);
  }

}


@Component({
  selector: 'app-remove-from-collection',
  template: `
  <h1 mat-dialog-title> Are you sure? </h1>
  <div mat-dialog-content>
    <p> After removing from the Collection, the pokemon will only be found in the main page. You still can re-add
    this pokemon later to the Collection. </p>
  </div>
  <div mat-dialog-actions>
    <button mat-button (click)="onNoClick()">No, Thanks</button>
    <button mat-button (click)="removeFromCollection()" cdkFocusInitial>Yes, i am</button>
  </div>`,
})
export class RemoveFromCollectionConfirmationDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<RemoveFromCollectionConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public pokemon: PokemonFullData) { }

  removeFromCollection() {
    let capturedPokemons = JSON.parse(localStorage.getItem('captured-pokemons')) as Array<PokemonFullData>;
    if (!capturedPokemons) {
      capturedPokemons = [];
    }

    capturedPokemons = capturedPokemons.filter(x => x.id !== this.pokemon.id);

    localStorage.setItem('captured-pokemons', JSON.stringify(capturedPokemons));
    this.onNoClick();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
