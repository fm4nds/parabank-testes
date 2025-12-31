import { Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async obterMensagem(): Promise<string> {
    try {
      await this.page.waitForLoadState('domcontentloaded');
      const content = await this.page.evaluate(
        () => document.body.innerText || document.body.textContent || ''
      );
      return content || (await this.page.textContent('body')) || '';
    } catch {
      return '';
    }
  }

  async fazerLogout(): Promise<void> {
    const linkLogout = this.page.locator('a[href*="logout"]');
    try {
      await linkLogout.waitFor({ state: 'visible' });
      await linkLogout.click();
      await this.page.waitForLoadState('networkidle');
    } catch {
      await this.page.goto('/parabank/logout.htm');
      await this.page.waitForLoadState('networkidle');
    }
  }
}
