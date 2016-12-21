import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, Resolve } from '@angular/router';

import { BehaviorSubject, Subject } from 'rxjs';

import { GameService } from '../game.service';
import { GameElement }  from '../../classes';

@Injectable()
export class GamePageResolveService implements Resolve<BehaviorSubject<GameElement>> {
  private game: BehaviorSubject<GameElement>;

  constructor(private router: Router, private gameService: GameService) { }

  resolve(route: ActivatedRouteSnapshot):boolean|Promise<BehaviorSubject<GameElement>> {
    let games = this.gameService.games.getValue();
    let id = route.params['id'];
    let index = games.map(g=>g.id).indexOf(id);

    if(id === undefined || index == -1) {
      this.router.navigate(['/games']); // should be 404
      return false;
    }
    let game = games[index];
    this.game = new BehaviorSubject(game);

    this.gameService.games.map(_games=>{
      return _games[_games.map(g=>g.id).indexOf(this.game.getValue().id)]
    }).distinct().subscribe(this.game);

    this.game.subscribe(g=>{
      console.log('game updated', g);
      let _games = this.gameService.games.getValue();
      let i = _games.map(g=>g.id).indexOf(g.id);
      if(i == -1) throw new Error('this has already been deleted');
      _games[i] = g;
      this.gameService.games.next(_games);
    });

    return Promise.resolve(this.game);


    //// 'watch' for changes.  push those changes to games array
    //this.game.do(game=>{
    //  game.state = 'UNSAVED';
    //}).debounceTime(1000).map((_game)=>{
    //  let _games = this.gameService.games.getValue();
    //  let index = _games.map(g=>g.id).indexOf(_game.id);
    //  console.log(_games, index, _game);
    //  if(index == -1) throw new Error('game was removed');
    //  _games[index] = _game;
    //  return _games;
    //}).subscribe(this.gameService.games);

    //return Promise.resolve(this.game); // hacky, should use 'hot' observable
  }

}
