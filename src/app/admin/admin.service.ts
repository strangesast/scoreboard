import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

@Injectable()
export class AdminService implements Resolve<void> {

  public listA: string[] = [1, 2, 3, 4, 5].map(n => 'Item ' + String.fromCharCode(n+64));
  public listB: string[] = [1, 2, 3].map(n => 'Item ' + n);

  constructor() { }

  resolve() {
  }
}
