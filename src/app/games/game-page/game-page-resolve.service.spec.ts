/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GamePageResolveService } from './game-page-resolve.service';

import { Router } from '@angular/router';

describe('GamePageResolveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ GamePageResolveService, Router ]
    });
  });

  it('should ...', inject([GamePageResolveService], (service: GamePageResolveService) => {
    expect(service).toBeTruthy();
  }));
});
