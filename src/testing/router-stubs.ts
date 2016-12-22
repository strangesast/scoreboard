import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';

import { GameElement } from '../app/classes';

const TEST_GAME = new GameElement('0', 'test', 'test game');

@Injectable()
export class ActivatedRouteStub {
  private subject = new BehaviorSubject(this.testParams);
  params = this.subject.asObservable();
  private _testParams: {};

  get testParams() {
    return this._testParams;
  }

  set testParams(params: {}) {
    this._testParams = params;
    this.subject.next(params);
  }

  get snapshot() {
    return { params: this.testParams };
  }

  public data = Observable.of({
    game: new BehaviorSubject(TEST_GAME),
    games: new BehaviorSubject([TEST_GAME])
  });
}
