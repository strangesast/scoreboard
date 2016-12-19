import { Input, Output, EventEmitter, Component, OnInit, OnChanges } from '@angular/core';

import { Timer } from '../classes';
import { Subject,Observable } from 'rxjs';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.less']
})
export class TimerComponent implements OnInit {
  @Input() timer: Timer;

  private timerState: Subject<any>;
  private time: number;
  @Output() private onAction = new EventEmitter<{type: string, target:any}>();

  private timeStep: number = 100;
  @Input() clock: Observable<any>; // sync clocks

  constructor() { }

  ngOnInit() {
    this.timerState = new Subject();
    this.time = this.timer.accum();

    this.timerState.switchMap(timer=>{
      console.log('new timer', timer);
      return timer.state == 'running' ?
        this.clock.map((t) =>timer.accum()) : // update ever clock tic
        Observable.of(this.timer.accum()); // update once (on change)
    }).subscribe(time => {
      this.time = time;
    });

    this.timerState.next(this.timer);
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
