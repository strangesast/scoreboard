/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Observable } from 'rxjs';

import { RouterTestingModule } from '@angular/router/testing';

import { TimerComponent } from './timer.component';
import { TimeMsPipe }     from './time-ms.pipe';
import { Timer }          from '../classes';

describe('TimerComponent', () => {
  let component: TimerComponent;
  let fixture: ComponentFixture<TimerComponent>;
  let timer: Timer;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimerComponent, TimeMsPipe ],
      imports: [ RouterTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerComponent);
    component = fixture.componentInstance;

    timer = new Timer('test', 'test timer');
    component.timer = timer;
    component.clock = Observable.interval(100);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
