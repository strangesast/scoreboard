import { ScoreboardPage } from './app.po';

describe('scoreboard App', function() {
  let page: ScoreboardPage;

  beforeEach(() => {
    page = new ScoreboardPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
