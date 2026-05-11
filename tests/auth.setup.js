// tests/auth.setup.js
import { test as setup } from '@playwright/test';

const users = [
  { role: 'admin', username: 'admin_user', password: 'admin_pass' },
  { role: 'client', username: 'client_user', password: 'client_pass' },
];

for (const user of users) {
  setup(`authenticate ${user.role}`, async ({ page,loginPage }) => {
    await loginPage.goto(); // fixed
      await loginPage.setZoom(0.98);
      await loginPage.login(username, password);

    await page.waitForURL('/dashboard');

    await page.context().storageState({
      path: `storage/${user.role}.json`,
    });
  });
}