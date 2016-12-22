import { Resolve } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { GameService } from '../game.service';
import { GameElement } from '../../classes';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.less']
})
export class GameListComponent implements OnInit {
  private gamesSubject: BehaviorSubject<GameElement[]>;
  private games: any[] = [];

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gamesSubject = this.gameService.getGames();
    this.gamesSubject.subscribe(games => {
      this.games = games;
    });
  }

  onRemoveGame(game) {
    this.gameService.removeGame(game);
  }
}
