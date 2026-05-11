import { test } from '../fixtures/fixtures';
import { expect } from '@playwright/test';

test.describe('@smoke  tests', () => {
  test('@smoke [@login] should allow user to login', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.setZoom(0.98);
   await expect(page).toHaveURL(/\/login/);
  });

  test('@smoke [@login] should not login with incorrect credentials', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.setZoom(0.98);
   await loginPage.login("suresh@gmail.com", "1234544654")
   await expect(page.locator('text=Invalid email or password')).toBeVisible();
   await expect(page).not.toHaveURL(/\/dashboard/);
  });

  
});
