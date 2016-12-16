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
    this.lastStart = -1;
    this.lastStop = -1;
    this.accumulated = 0;
  }

  static fromObject(obj: any) {
    let t = new Timer(obj.name, obj.description);
    t.lastStop = obj.lastStop;
    t.lastStart = obj.lastStart;
    t.accumulated = obj.accumulated;
    return t;
  }
}
