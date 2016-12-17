export type SaveState = 'SAVED'|'UNSAVED';

export class GameElement {
  constructor (
    public id: string,
    public name: string,
    public description: string,
    public state: SaveState = 'UNSAVED',
    public timers: Timer[] = []
  ) { }
  static fromObject(obj: any) {
    return new GameElement(obj.id, obj.name, obj.description, obj.state, obj.timers.map(t=>Timer.fromObject(t)));
  }
}

export class Timer {
  public lastStart: number = -1;
  public lastStop: number = -1;
  public accumulated: number = 0;

  constructor(
    public name: string,
    public description: string
  ) { }

  reset() {
    let tot = this.accum();
    this.lastStart = -1;
    this.lastStop = -1;
    this.accumulated = 0;
    return tot;
  }

  start() {
    this.lastStart = Number(Date.now());
    return this.lastStart;
  }

  accum() {
    if(this.lastStart == -1) return 0;
    console.log((this.lastStop > this.lastStart ? (this.lastStop - this.lastStart) : (Date.now() - this.lastStart)) + this.accumulated);

    return (this.lastStop > this.lastStart ? (this.lastStop - this.lastStart) : (Date.now() - this.lastStart)) + this.accumulated;
  }

  stop() {
    if(this.lastStart == -1) throw new Error('already stopped');
    this.lastStop = Number(Date.now());
    this.accumulated = this.accumulated + this.lastStop - this.lastStart
    return this.lastStop;
  }

  static fromObject(obj: any) {
    let t = new Timer(obj.name, obj.description);
    t.lastStop = obj.lastStop;
    t.lastStart = obj.lastStart;
    t.accumulated = obj.accumulated;
    return t;
  }
}
