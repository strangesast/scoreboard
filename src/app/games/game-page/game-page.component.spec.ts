/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '../../../testing/router-stubs';

import { GameService } from '../game.service';

import { GamePageComponent } from './game-page.component';
import { TimerComponent } from '../../timer/timer.component';
import { TimeMsPipe } from '../../timer/time-ms.pipe';

describe('GamePageComponent', () => {
  let component: GamePageComponent;
  let fixture: ComponentFixture<GamePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamePageComponent, TimerComponent, TimeMsPipe ],
      providers: [ GameService, { provide: ActivatedRoute, useClass: ActivatedRouteStub } ],
      imports: [ FormsModule, ReactiveFormsModule, RouterTestingModule.withRoutes([]) ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
