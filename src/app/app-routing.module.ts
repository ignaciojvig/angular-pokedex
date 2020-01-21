import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { CollectionComponent } from './collection/collection.component';


const routes: Routes = [
  {
    path: '',
    component: MainScreenComponent,
    pathMatch: 'full'
  },
  {
    path: 'collection',
    component: CollectionComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
