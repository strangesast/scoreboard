import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { GameListComponent } from './games/game-list/game-list.component';
import { NewGameComponent } from './games/game-list/new-game/new-game.component';
import { GamePageComponent } from './games/game-page/game-page.component';
import { AdminPageComponent } from './admin/admin-page/admin-page.component';
import { HomeComponent } from './home/home.component';

import { GameService } from './games/game.service';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'games', resolve: {
    gameService: GameService
  }, children: [
    { path: '', component: GameListComponent },
    { path: 'new', component: NewGameComponent },
    { path: ':gameId', component: GamePageComponent }
  ] },
  { path: 'admin', component: AdminPageComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    GameService
  ]
})
export class AppRoutingModule { }
