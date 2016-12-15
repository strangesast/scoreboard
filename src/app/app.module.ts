import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { GameListComponent } from './games/game-list/game-list.component';
import { GamePageComponent } from './games/game-page/game-page.component';
import { AdminPageComponent } from './admin/admin-page/admin-page.component';
import { HomeComponent } from './home/home.component';
import { NewGameComponent } from './games/game-list/new-game/new-game.component';

@NgModule({
  declarations: [
    AppComponent,
    GameListComponent,
    GamePageComponent,
    AdminPageComponent,
    HomeComponent,
    NewGameComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
