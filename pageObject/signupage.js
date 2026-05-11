import { expect } from '@playwright/test';

export default class SignupPage {
  constructor(page) {
    this.page = page;
  }

  async navigateToSignup() {
    await this.page.goto('https://stage.finspectors.ai/signup');
  }

  async enterEmail(email) {
    await this.page.locator("(//label[contains(.,'Email Address*')]/following::input)[1]").fill(email);
  }

  async enterPassword(password) {
    await this.page.locator("(//label[text()='Password']/following::input)[1]").fill(password);
  }

  async enterConfirmPassword(confirmpassword) {
    await this.page.locator("(//label[text()='Confirm Password']/following::input)[1]").fill(confirmpassword);
  }

  async clickSignup() {
    await this.page.locator('button:has-text("Create Account")').click();
    await this.page.waitForTimeout(2000);
    await this.page.getByText(/Verify Account/i).first().waitFor({ state: 'visible', timeout: 60000 });
  }

  async signup(email, password, confirmpassword) {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.enterConfirmPassword(confirmpassword);
    await this.clickSignup();
  }

  // Lazy getters: evaluated only when used
  get welcomeAboardText() {
    return this.page.getByText(/welcome aboard/i);
  }

  get letsStartedBtn() {
    return this.page.getByRole('button', { name: /let'?s started|get started/i }).first();
  }

  get fullNameInput() {
    return this.page.locator('xpath=(//label[contains(normalize-space(),"Full Name")]/following::input)[1]');
  }

  get companyNameInput() {
    return this.page.locator('xpath=(//label[contains(normalize-space(),"Company Name")]/following::input)[1]');
  }

  get countryDropdown() {
    return this.page.locator('select, [role="combobox"]').first();
  }

  get continueBtn() {
    return this.page.getByRole('button', { name: /continue|next|submit|save|complete setup/i }).first();
  }

  async completeWelcomeOnboarding(fullName, companyName, country) {
    await expect(this.welcomeAboardText).toBeVisible({ timeout: 60000 });
    await this.letsStartedBtn.click();

    await this.fullNameInput.fill(fullName);
    await this.companyNameInput.fill(companyName);

    await this.countryDropdown.click();
    await this.page.getByText(country, { exact: true }).click();

    await this.continueBtn.click();
    await this.page.waitForTimeout(2000);
  }
}