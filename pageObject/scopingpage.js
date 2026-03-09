export default class ScopingPage {
  constructor(page) {
    this.page = page;
  }

  async clickSubmitButton() {
    const submitButton = this.page.getByRole('button', { name: /Submit/i }).first();
    await submitButton.waitFor({ state: 'visible', timeout: 10000 });
    await submitButton.click({ timeout: 10000 });
    await submitButton.click({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1200);
  }

  async scopeFsliRow(fsliLabel) {
    const fsliRows = this.page
      .locator('[role="rowgroup"]')
      .filter({ has: this.page.getByRole('row', { name: new RegExp(fsliLabel, 'i') }) })
      .first()
      .getByRole('row');

    const targetRow = fsliRows
      .filter({ hasText: new RegExp(fsliLabel, 'i') })
      .first();

    await targetRow.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});

    const targetIndex = await fsliRows.evaluateAll(
      (rows, name) =>
        rows.findIndex((row) =>
          row.textContent?.toLowerCase().includes(String(name).toLowerCase())
        ),
      fsliLabel
    );

    // ✅ If FSLI not found → Skip and continue
    if (targetIndex < 0) {
      console.log(`⚠️ ${fsliLabel} row not found in scoping table. Skipping...`);
      return;
    }

    const actionIcons = this.page.locator('[role="rowgroup"] [role="gridcell"] img');

    if ((await actionIcons.count()) > targetIndex) {
      await actionIcons.nth(targetIndex).click({ timeout: 10000 });
    } else {
      await targetRow.click({ timeout: 10000 });
    }

    await this.page.waitForTimeout(700);

    const scopedToggles = this.page.getByRole('switch');
    const scopedToggle =
      (await scopedToggles.count()) > targetIndex
        ? scopedToggles.nth(targetIndex)
        : scopedToggles.first();

    await scopedToggle.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});

    const isChecked = await scopedToggle.isChecked().catch(() => false);
    if (!isChecked) {
      await scopedToggle.click({ timeout: 10000 });
      await this.page.waitForTimeout(500);
    }

    const justificationBox = this.page
      .getByRole('textbox', {
        name: /Justification|justification|Reason for status/i
      })
      .first();

    if (await justificationBox.isVisible().catch(() => false)) {
      await justificationBox.click({ timeout: 10000 });
      await justificationBox.fill('Needed to be scoped');
    }

    const saveChangesButton = this.page
      .getByRole('button', { name: /Save Changes|Save/i })
      .first();

    if (await saveChangesButton.isVisible().catch(() => false)) {
      await saveChangesButton.click({ timeout: 10000 });
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(1200);
    }
  }

  async openScoping(fsliname) {
    try {
      await this.page.locator('a').filter({ hasText: 'Scoping' }).click();
      await this.page.waitForURL('**/scoping**', { timeout: 15000 });
      await this.page.waitForLoadState('networkidle');
      await this.page
        .getByRole('heading', { name: 'Scoping' })
        .waitFor({ state: 'visible', timeout: 15000 });

      const fsliRowsToScope = Array.isArray(fsliname)
        ? fsliname
        : typeof fsliname === 'string' && fsliname.trim()
          ? [fsliname]
          : [];

      if (fsliRowsToScope.length === 0) {
        return;
      }

      for (const fsliLabel of fsliRowsToScope) {
        await this.scopeFsliRow(fsliLabel);
      }

      await this.clickSubmitButton();

    } catch (error) {
      console.error('Error in openScoping:', error.message);
      throw error;
    }
  }
}