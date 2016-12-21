import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { GameElement } from '../../../classes';
import { GameService } from '../../game.service';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.less']
})
export class NewGameComponent implements OnInit {
  private savedGame: GameElement;

  private form: FormGroup;
  private saveError: any;

  constructor(private formBuilder: FormBuilder, private router: Router, private gameService: GameService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', [
        Validators.minLength(5),
        Validators.required]
      ],
      description: ''
    });
  }

  onSubmit() {
    if(this.form.valid) {
      this.gameService.saveNewGame(this.form.value).subscribe(
        (newGame)=>{
          this.savedGame = newGame;
        },
        (error)=>{
          console.error('error!', error);
          this.savedGame = null;
          this.saveError = error;
        },
        () => {
          this.saveError = null;
          setTimeout(()=>this.router.navigate(['/games'], { fragment: this.savedGame.id }), 1000);
        }
      );
    }
  }
  onCancel() {
    this.form.reset();
    this.router.navigate(['../']);
  }
}
