import { DiadminPage } from './app.po';

describe('diadmin App', function() {
  let page: DiadminPage;

  beforeEach(() => {
    page = new DiadminPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
