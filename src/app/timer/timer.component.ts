import { Input, Output, Component, OnInit, OnChanges } from '@angular/core';

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

  private timeStep: number = 100;
  @Input() clock: Observable<any>; // sync clocks

  constructor() { }

  ngOnInit() {
    this.timerState = new Subject();
    this.time = 0;

    this.timerState.switchMap(timer=>{
      return (this.clock || Observable.interval(this.timeStep)).map((t) => {
        this.time+=1;
      })
    }).subscribe();

    this.timerState.next(this.timer);
  }

  ngOnChanges(changes) {

  }
}
