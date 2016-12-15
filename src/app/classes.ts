export class GameElement {
  constructor (
    public id: string,
    public name: string,
    public description: string,
    public state: string = 'UNSAVED'
  ) {}
  static fromObject(obj: any) {
    return new GameElement(obj.id, obj.name, obj.description, obj.state);
  }
}
