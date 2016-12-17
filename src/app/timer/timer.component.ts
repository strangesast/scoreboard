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
    this.time = 0;

    this.timerState.switchMap(timer=>{
      return (this.clock || Observable.interval(this.timeStep)).map((t) => {
        this.time=this.timer.accum();
      })
    }).subscribe();

    this.timerState.next(this.timer);
  }

  ngOnChanges(changes) {

  }

  remove() {
    this.onAction.emit({type: 'remove', target: this.timer});
  }
}
