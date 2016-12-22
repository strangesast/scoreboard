import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { GameListComponent } from './games/game-list/game-list.component';
import { NewGameComponent } from './games/game-list/new-game/new-game.component';
import { GamePageComponent } from './games/game-page/game-page.component';
import { AdminPageComponent } from './admin/admin-page/admin-page.component';
import { HomeComponent } from './home/home.component';

import { AdminService } from './admin/admin.service';
import { GameService } from './games/game.service';
import { GamePageResolveService } from './games/game-page/game-page-resolve.service';

const routes: Routes = [
  { path: '', component: HomeComponent, resolve: { games: GameService } },
  { path: 'games', resolve: {
    games: GameService
  }, children: [
    { path: '', component: GameListComponent },
    { path: 'new', component: NewGameComponent },
    { path: ':id', component: GamePageComponent, resolve: {
      game: GamePageResolveService
    } }
  ] },
  { path: 'admin', component: AdminPageComponent, resolve: {
    admin: AdminService,
    games: GameService
  } }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    GameService,
    AdminService,
    GamePageResolveService
  ]
})
export class AppRoutingModule { }
