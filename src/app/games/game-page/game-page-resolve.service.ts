import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, Resolve } from '@angular/router';

import { BehaviorSubject, Subject } from 'rxjs';

import { GameService } from '../game.service';
import { GameElement }  from '../../classes';

@Injectable()
export class GamePageResolveService implements Resolve<boolean|Promise<boolean|BehaviorSubject<GameElement>>> {
  private game: BehaviorSubject<GameElement>;

  constructor(private router: Router, private gameService: GameService) { }

  resolve(route: ActivatedRouteSnapshot): boolean|Promise<BehaviorSubject<GameElement>> {
    let id = route.params['id'];

    if (id === undefined) {
      this.router.navigate(['/games']); // should be 404
      return false;
    }
    return this.gameService.getGameById(id)
      .then(bs => this.game = bs)
      .catch(err => {
        this.router.navigate(['/games']); // should be 404
        return false;
      });
  }

}
