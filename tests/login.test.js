// // @ts-check
// // @ts-ignore
// import { test, expect } from '@playwright/test';

// test('has title', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pageObject/loginpage');

test.describe('Login Test Suite', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('TC01 - Valid Login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(process.env.EMAIL, process.env.PASSWORD);
    await expect(page).toHaveURL(process.env.DASHBOARD_URL); // update if needed
    await loginPage.logout();
  });

  test('TC02 - Invalid Password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(process.env.EMAIL, process.env.INVALID_PASSWORD);FinspectorsAutomation-feature-introduce-best-practices
    await expect(loginPage.errorMessage).toBeVisible();
    
  });

  test('TC03 - Invalid Email', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(process.env.INVALID_EMAIL, process.env.PASSWORD);

    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('TC04 - Empty Fields', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login('', '');

    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('TC05 - Only Email Entered', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(process.env.EMAIL, '');

    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('TC06 - Only Password Entered', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(process.env.EMAIL, process.env.PASSWORD);

    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('TC07 - Remember Me Functionality', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.toggleRememberMe();
    await loginPage.login(process.env.EMAIL, process.env.PASSWORD);

    await expect(page).toHaveURL(process.env.DASHBOARD_URL); // update if needed
  });

  test('TC08 - Forgot Password Navigation', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.clickForgotPassword();

    await expect(page).toHaveURL(process.env.FORGOT_PASSWORD_URL); // update if needed
  });

});