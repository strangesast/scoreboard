import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject, Observable, BehaviorSubject } from 'rxjs';

import { GameService } from '../../games/game.service';
import { AdminService } from '../admin.service';

import { GameElement } from '../../classes';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.less']
})
export class AdminPageComponent implements OnInit {
  public listA: string[];
  public listB: string[];
  public conn;
  public connSubject: BehaviorSubject<any[]>;
  private gamesSubject: BehaviorSubject<GameElement[]>;
  public stream: Subject<any> = new Subject();

  public selectedItem;

  constructor(
    private adminService: AdminService,
    private gameService: GameService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.data.subscribe(({games, admin}) => {
      this.gamesSubject = games;
      this.gamesSubject.subscribe(_games => {
        this.listA = _games.map(g => g.name);
        this.listB = this.adminService.listB;
        let evensA = this.listA.filter((el, i) => i % 2);
        let oddsB = this.listB.filter((el, i) => (i + 1) % 2);
        this.conn = evensA.map(
          (el, i) => [
            this.listA.indexOf(el),
            this.listB.indexOf(i < oddsB.length ? oddsB[i] : oddsB[oddsB.length - 1])
          ]);
      });
    });


    let [streamA, streamB] = this.stream.partition(el => this.listA.indexOf(el) !== -1);

    // not ideal. doesn't 'unselect' streamB
    streamA.withLatestFrom(streamB.do(x => this.selectedItem = x)).subscribe(([a, b]) => {
      let n = [this.listA.indexOf(a), this.listB.indexOf(b)];
      let c = this.conn.map(el => el.join(','));
      let i = c.indexOf(n.join(','));
      if (i === -1) {
        this.conn.push(n);
      } else {
        this.conn.splice(i, 1);
      }
    });
  }

  calc(posA, posB) {
    let d = Math.abs(posB[0] - posA[0]) / 2;
    return ['M', posA.join(' '), 'C', posA[0] + d, posA[1], posB[0] - d, posB[1], posB.join(' ')].join(' ');
  }

  onApply() {
  }

}
