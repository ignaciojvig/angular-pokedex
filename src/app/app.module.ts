import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainNavComponent } from './main-nav/main-nav.component';
import { HttpClientModule } from '@angular/common/http';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { MaterialModule } from './material/app.material.module';
import { IconCreditsComponent } from './icon-credits/icon-credits.component';
import { DetailsComponent } from './main-screen/details/details.component';

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    MainScreenComponent,
    IconCreditsComponent,
    DetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule
  ],
  entryComponents: [DetailsComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
