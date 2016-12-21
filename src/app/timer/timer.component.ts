import { Input, Output, EventEmitter, Component, OnInit, OnChanges } from '@angular/core';

import { Timer } from '../classes';
import { Subject, BehaviorSubject, ReplaySubject, Observable } from 'rxjs';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.less']
})
export class TimerComponent implements OnInit {
  @Input() timer: Timer;

  private timerState: BehaviorSubject<any>;
  private time:ReplaySubject<number> = new ReplaySubject(1);
  private timeInstance: number = 0;

  @Output() private onAction = new EventEmitter<{type: string, target:any}>();

  private timeStep: number = 100;
  @Input() clock: Observable<any>; // sync clocks

  constructor() { }

  ngOnInit() {
    this.timerState = new BehaviorSubject(this.timer);

    this.timerState.switchMap(timer=>{
      return timer.state == 'running' ?
        this.clock.map((t) =>timer.accum()) : // update ever clock tic
        Observable.of(timer.accum()); // update once (on change)
    }).subscribe(this.time);

    this.time.subscribe(t=>{
      this.timeInstance=t;
    });
  }

  ngOnChanges(changes) {
  }

  onStart() {
    this.timer.start();
    this.onAction.emit({type: 'start', target: this.timer});
  }
  onStop() {
    this.timer.stop();
    this.onAction.emit({type: 'stop', target: this.timer});
  }
  onReset() {
    this.timer.reset();
    this.onAction.emit({type: 'reset', target: this.timer});
  }
  remove() {
    this.onAction.emit({type: 'remove', target: this.timer});
  }
}
