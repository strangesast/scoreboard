export type SaveState = 'SAVED'|'UNSAVED';

export class GameElement {
  static fromObject(obj: any) {
    return new GameElement(obj.id, obj.name, obj.description, obj.state, obj.timers.map(t => Timer.fromObject(t)));
  }

  constructor (
    public id: string,
    public name: string,
    public description: string,
    public state: SaveState = 'UNSAVED',
    public timers: Timer[] = []
  ) { }
}

export class Timer {
  public lastStart: number = -1;
  public lastStop: number = -1;
  public accumulated: number = 0;

  static fromObject(obj: any) {
    let t = new Timer(obj.name, obj.description);
    t.lastStop = obj.lastStop;
    t.lastStart = obj.lastStart;
    t.accumulated = obj.accumulated;
    return t;
  }

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
    if (this.lastStart !== -1) {
      throw new Error('already started');
    }
    Object.assign(this, {lastStop: -1, lastStart: Date.now()});
    return this.lastStart;
  }

  accum() {
    if (this.lastStart === -1) {
      return this.accumulated;
    }
    return this.accumulated + (this.lastStop > this.lastStart ? (this.lastStop - this.lastStart) : (Date.now() - this.lastStart));
  }

  stop() {
    if (this.lastStart === -1 || this.lastStop > this.lastStart) {
      throw new Error('already stopped');
    }
    this.lastStop = Date.now();
    this.accumulated += (this.lastStop - this.lastStart);
    this.lastStart = -1;
    return this.lastStop;
  }

  get state() {
    if (this.lastStart !== -1 && this.lastStart > this.lastStop) {
      return 'running';
    } else if (this.lastStop !== -1 && this.lastStop > this.lastStart) {
      return 'stopped';
    } else if (this.lastStart === -1) {
      return 'reset';
    } else {
      throw new Error('invalid state');
    }
  }
  set state(newState: string) {
    switch (newState) {
      case 'running':
        this.lastStart = Date.now();
        break;
      case 'stopped':
        this.lastStop = Date.now();
        break;
      case 'reset':
        this.lastStart = -1;
        this.lastStop = -1;
        this.accumulated = 0;
        break;
      default:
        throw new Error('invalid state');
    }
  }
}
