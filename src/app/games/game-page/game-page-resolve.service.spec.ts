/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GamePageResolveService } from './game-page-resolve.service';

import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { GameService } from '../game.service';

describe('GamePageResolveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ GamePageResolveService, RouterModule, GameService ],
      imports: [ RouterTestingModule ]
    });
  });

  it('should ...', inject([GamePageResolveService], (service: GamePageResolveService) => {
    expect(service).toBeTruthy();
  }));
});
