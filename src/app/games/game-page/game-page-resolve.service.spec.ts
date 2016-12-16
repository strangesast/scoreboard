/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GamePageResolveService } from './game-page-resolve.service';

describe('GamePageResolveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GamePageResolveService]
    });
  });

  it('should ...', inject([GamePageResolveService], (service: GamePageResolveService) => {
    expect(service).toBeTruthy();
  }));
});
