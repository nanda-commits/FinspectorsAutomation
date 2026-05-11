const { env } = require("node:process");

class LoginPage {
  constructor(page) {
    this.page = page;

    this.emailInput = page.locator('//input[@placeholder="Enter Email"]');
    this.passwordInput = page.locator('//input[@placeholder="Enter Password"]');
    this.loginButton = page.locator('button:has-text("Login")');
    this.rememberMeCheckbox = page.locator('input[type="checkbox"]');
    this.forgotPasswordLink = page.locator('text=Forgot your Password?');
    this.googleLogin = page.locator('button:has-text("Google")');
    this.microsoftLogin = page.locator('button:has-text("Microsoft")');
    this.errorMessage = page.locator('.error, .alert, text=Invalid'); // adjust if needed
    this.profileMenu = page.locator('//*[@id="radix-:r6:"]/img'); // adjust if needed
    this.logoutButton = page.locator('//p[normalize-space(text())="Logout"]'); // adjust if needed
  }

  async navigate() {
    await this.page.goto(process.env.URL); // replace with actual URL
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
  async logout(){
    await this.profileMenu.click();
    await this.logoutButton.click();
  }
  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }

  async clickGoogleLogin() {
    await this.googleLogin.click();
  }

  async clickMicrosoftLogin() {
    await this.microsoftLogin.click();
  }

  async toggleRememberMe() {
    await this.rememberMeCheckbox.check();
  }
}

module.exports = { LoginPage };