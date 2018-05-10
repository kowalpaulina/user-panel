import { AdminPanelPage } from './app.po';

describe('admin-panel App', () => {
  let page: AdminPanelPage;

  beforeEach(() => {
    page = new AdminPanelPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
