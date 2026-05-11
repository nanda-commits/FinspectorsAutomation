import { test, expect } from '@playwright/test';
import SignupPage from '../pageObject/signupage';
import GmailPage from '../pageObject/gmailPage';

test('Signup and verify email', async ({ page, context }) => {
  test.setTimeout(180000);

  const signup = new SignupPage(page);

  const email = 'nanda+0090@finspectors.ai';
  const password = 'Test@12345';
  const confirmpassword = password;
  const emailid = 'nanda@finspectors.ai';
  const emailPassword = 'Brave@3333';

  await signup.navigateToSignup();
  await signup.signup(email, password, confirmpassword);

  const emailPage = await context.newPage();
  const gmail = new GmailPage(emailPage);

  await gmail.open();
  await gmail.login(emailid, emailPassword);
  await gmail.openMailBySubject('Email verification');

  const targetPage = await gmail.clickConfirmEmailAddress();
  await expect(targetPage).toHaveURL(/verify-email|confirm|success|login|welcome/i);

  const onboarding = new SignupPage(targetPage);
  await onboarding.completeWelcomeOnboarding('Nanda', 'Finspectors', 'India');
  
});
