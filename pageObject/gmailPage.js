import { expect } from '@playwright/test';

export default class GmailPage {
  constructor(page) {
    this.page = page;
  }

  async open() {
    await this.page.goto('https://mail.google.com');
  }

  async login(email, password) {
    await this.page.fill('input[type="email"]', email);
    await this.page.click('#identifierNext');
    await this.page.waitForSelector('input[type="password"]', { state: 'visible' });
    await this.page.fill('input[type="password"]', password);
    await this.page.click('#passwordNext');
  }

  async openMailBySubject(subject) {
    const mail = this.page.locator('tr.zA').filter({ hasText: new RegExp(subject, 'i') }).first();
    await expect(mail).toBeVisible({ timeout: 60000 });
    await mail.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickConfirmEmailAddress() {
    const mailBody = this.page.locator('div.a3s');
    await expect(mailBody).toBeVisible({ timeout: 60000 });
    await expect(mailBody).toContainText(/Confirm your email address/i);

    const confirmLink = mailBody.locator('a:has-text("Confirm Email Address")').first();
    await expect(confirmLink).toBeVisible({ timeout: 30000 });

    const popupPromise = this.page.context().waitForEvent('page', { timeout: 15000 }).catch(() => null);
    await confirmLink.click();

    const popup = await popupPromise;
    const targetPage = popup ?? this.page;
    await targetPage.waitForLoadState('domcontentloaded');
    return targetPage;
  }
}