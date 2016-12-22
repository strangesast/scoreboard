import { OnInit, Component } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { GameService } from './games/game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'ninja works!';

  public isSaving: BehaviorSubject<boolean>;

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.isSaving = this.gameService.isSaving;
  }
}
