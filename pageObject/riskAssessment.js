
class RiskAssessmentPage {
  constructor(page) {
    this.page = page;
  }

  async waitForConfigureButton(timeoutMs = 20000) {
    const configureButton = this.page.getByRole('button', { name: 'Configure' }).first();
    if (await configureButton.isVisible().catch(() => false)) {
      await this.page.waitForFunction(
        (button) => !!button && !button.disabled,
        await configureButton.elementHandle(),
        { timeout: timeoutMs }
      );
      return configureButton;
    }

    const configureRadio = this.page.getByRole('radio', { name: 'Configure' }).first();
    await configureRadio.waitFor({ state: 'visible', timeout: timeoutMs });
    return configureRadio;
  }

   async openRiskAssessment() {
    if (this.page.isClosed()) {
      throw new Error('Page is closed before opening Risk Assessment.');
    }

    const planningButton = this.page.getByRole('button', { name: 'Planning' }).first();
    await planningButton.waitFor({ state: 'visible', timeout: 15000 });

    const submenuCandidates = [
      this.page.locator('li:has(button:has-text("Planning"))').locator('a,button,div,span').filter({ hasText: /^Risk Assessment$/ }).first(),
      this.page.getByRole('button', { name: 'Risk Assessment' }).first(),
      this.page.locator('a:has-text("Risk Assessment"):not([aria-disabled="true"])').first(),
    ];

    for (let attempt = 0; attempt < 2; attempt++) {
      for (const candidate of submenuCandidates) {
      if (await candidate.isVisible().catch(() => false)) {
        const disabled = await candidate.evaluate((node) => node.getAttribute('aria-disabled') === 'true').catch(() => false);
        if (!disabled) {
        await candidate.click();
        await this.page.waitForTimeout(3000);
        return;
        }
      }
      }

      await planningButton.click().catch(() => {});
      await this.page.waitForTimeout(800);
    }

    const finalTarget = this.page
      .locator('li:has(button:has-text("Planning"))')
      .locator('a,button,div,span')
      .filter({ hasText: /Risk Assessment/i })
      .first();
    await finalTarget.waitFor({ state: 'visible', timeout: 15000 });
    await finalTarget.click();
    await this.page.waitForTimeout(3000);
    }

  async configureRiskAssessment() {
    let configureControl = await this.waitForConfigureButton(20000);
    await configureControl.click().catch(async () => {
      await this.openRiskAssessment();
      configureControl = await this.waitForConfigureButton(15000);
      await configureControl.click();
    });

   // Rule groups
const groupA = [2, 4, 6];
const groupB = [3, 7, 10];

// 🔘 Step 1: Click Configure (if visible)
const configureRadio = this.page.getByRole('radio', { name: 'Configure' }).first();

if (await configureRadio.isVisible().catch(() => false)) {
  await configureRadio.click();
}

// Get all switches
const switches = this.page.getByRole('switch');

// Function to check if entire group is active
async function isGroupActive(group) {
  for (const index of group) {
    if (!(await switches.nth(index).isChecked())) {
      return false;
    }
  }
  return true;
}

// 🔍 Step 2: Detect active group
const isGroupAActive = await isGroupActive(groupA);

const groupToRemove = isGroupAActive ? groupA : groupB;
const groupToAdd = isGroupAActive ? groupB : groupA;

// 🔁 Step 3: Deselect current group
for (const index of groupToRemove) {
  const rule = switches.nth(index);
  if (await rule.isChecked()) {
    await rule.click();
  }
}

// 🔁 Step 4: Select new group
for (const index of groupToAdd) {
  const rule = switches.nth(index);
  if (!(await rule.isChecked())) {
    await rule.click();
  }
}

// 🔘 Step 5: Click Apply
const applyButton = this.page.getByRole('button', { name: 'Apply' }).first();
await applyButton.waitFor({ state: 'visible', timeout: 15000 });
await this.page.waitForFunction(
  (button) => !!button && !button.disabled,
  await applyButton.elementHandle(),
  { timeout: 15000 }
);
await applyButton.scrollIntoViewIfNeeded();
await applyButton.click().catch(async () => {
  await applyButton.click({ force: true });
});
  }

  async waitForValidationComplete() {
    // After: await riskAssessmentPage.waitForValidationComplete();
const runningHeading = this.page.getByRole('heading', { name: /Running the Fins Brain/i });

const isValidationStarted = await runningHeading.isVisible().catch(() => false);
if (isValidationStarted) {
    // Wait up to 20 minutes for validation to finish
    await runningHeading.waitFor({ state: 'hidden', timeout: 1200000 });
} else {
    // Optionally, add a short wait before final check
    await this.page.waitForTimeout(2000);
    if (await runningHeading.isVisible().catch(() => false)) {
        const body = await this.page.content();
        console.error('Validation did not complete. Page HTML:', body);
        throw new Error('Risk assessment validation did not complete in time.');
    }
}
  }

  async reviewFsliTable() {
    await this.page.getByRole('radio', { name: 'FSLI Table' }).click();
    await this.page.locator("//p[normalize-space(text())='Expenses']").click();
    await this.page.waitForTimeout(2000);
  }

  async reviewTransactions() {
    await this.page.getByRole('radio', { name: 'Transactions' }).click();
  }

  async openDashboard() {
    await this.page.getByRole('radio', { name: 'Dashboard' }).click();
  }

  async submitAssessment() {
    await this.waitForValidationComplete();
    await this.page.getByRole('button', { name: 'Submit' }).click();
    await this.page.getByRole('button', { name: 'Submit' }).click();
    await this.page.getByText('Pending Review').click();
  }
}

module.exports = RiskAssessmentPage;