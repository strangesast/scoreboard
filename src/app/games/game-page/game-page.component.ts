import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable, Subscription, BehaviorSubject } from 'rxjs';

import { GameService } from '../game.service';

import { GameElement, Timer } from '../../classes';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.less']
})
export class GamePageComponent implements OnInit, OnDestroy {
  private gameSubject: BehaviorSubject<GameElement>;
  private gameSubjectSub: Subscription;
  private game: GameElement;

  private scoreA: number = 0;
  private scoreB: number = 0;

  private gameTimersSubject: BehaviorSubject<Timer[]>;

  private form: FormGroup;
  private isEditing: boolean = false;
  // refresh clock every 0.1 s
  private clock: Observable<any> = Observable.interval(100).share(); // share is key

  constructor(private formBuilder: FormBuilder, private gameService: GameService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(({game}) => {
      this.gameSubject = game;
      this.game = game.getValue();
      console.log(this.game);
      if (this.gameSubjectSub) {
        this.gameSubjectSub.unsubscribe();
      }
      this.gameSubjectSub = this.subscribeTo(this.gameSubject);
    });
    this.form = this.formBuilder.group({
      name: [this.game.name, [
        Validators.minLength(5),
        Validators.required]
      ],
      description: this.game.description
    });
  }

  ngOnDestroy() {
    this.gameSubjectSub.unsubscribe();
  }

  subscribeTo(g): Subscription {
    return g.subscribe(res => {
      this.isEditing = false;
      if (this.form) {
        this.form.patchValue(res);
        this.form.markAsPristine();
      }
      this.game = res;
    });
  };

  incrementScore(team, by) {
    if(team == 'A') {
      this.scoreA+=Math.max(this.scoreA+by, 0);
    } else if (team == 'B') {
      this.scoreB+=Math.max(this.scoreB+by, 0);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.gameSubject.next(GameElement.fromObject(Object.assign({}, this.game, this.form.value)));
    }
  }
  onCancel() {
    this.form.patchValue(this.game);
    this.isEditing = false;
  }

  toggleEdit() {
    if (this.isEditing && this.form) {
      this.form.patchValue(this.game);
    }
    this.isEditing = !this.isEditing;
  }

  createNewTimer() {
    let timer = new Timer('new timer', 'a new timer');
    let game = this.game;
    game.timers = game.timers.concat(timer);
    this.gameSubject.next(game);
  }

  handleAction({type, target}) {
    console.log('target', target);
    if (type === 'remove') {
      this.removeTimer(target);
    } else if (['start', 'stop', 'reset'].indexOf(type) !== -1) {
      this.updateTimer(target);
    }
  }

  removeTimer(timer: Timer) {
    let game = this.gameSubject.getValue();
    let i = game.timers.indexOf(timer);
    if (i === -1) {
      throw new Error('timer already removed');
    }
    game.timers.splice(i, 1);
    this.gameSubject.next(this.game);
  }

  updateTimer(timer: Timer) {
    let game = this.gameSubject.getValue();
    let i = game.timers.indexOf(timer);
    if (i === -1) {
      throw new Error('timer already removed');
    }
    game.timers[i] = timer;
    this.gameSubject.next(this.game);
  }
}
