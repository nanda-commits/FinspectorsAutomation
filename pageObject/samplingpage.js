 
 class SamplingPage {
    constructor(page) {
        this.page = page;
    }

 async ensureActivePage() {
  if (!this.page.isClosed()) {
    return;
  }

  const active = this.page
    .context()
    .pages()
    .filter((p) => !p.isClosed())
    .pop();

  if (!active) {
    throw new Error('No active browser page is available.');
  }

  this.page = active;
 }

 async clickFirstVisible(locator, timeoutMs = 10000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const count = await locator.count().catch(() => 0);
    for (let i = 0; i < count; i++) {
      const candidate = locator.nth(i);
      if (await candidate.isVisible().catch(() => false)) {
        await candidate.click({ force: true });
        return true;
      }
    }
    await this.page.waitForTimeout(200);
  }

  return false;
 }

 async openTechniquePicker() {
  const triggerFromPlaceholder = this.page.locator('xpath=//*[normalize-space()="Select sampling technique"]');

  if (await this.clickFirstVisible(triggerFromPlaceholder, 4000)) {
    return;
  }

  const triggerFromValue = this.page
    .locator('xpath=//*[normalize-space()="Top X Samples" or normalize-space()="Above Threshold" or normalize-space()="Coverage Based"]');

  if (await this.clickFirstVisible(triggerFromValue, 4000)) {
    return;
  }

  const triggerInSamplingSection = this.page
    .locator('main div')
    .filter({ hasText: /Sampling\s*Technique/i })
    .locator('div')
    .filter({ hasText: /Select\s*sampling\s*technique|Top\s*X\s*Samples|Above\s*Threshold|Coverage\s*Based/i });

  if (await this.clickFirstVisible(triggerInSamplingSection, 6000)) {
    return;
  }

  throw new Error('Sampling technique dropdown trigger is not visible.');
 }

 async chooseTechnique(techniqueName) {
  await this.ensureActivePage();
  await this.openTechniquePicker();
  await this.page.waitForTimeout(400);

  const option = this.page
    .locator('text=/Above\\s*Threshold|Top\\s*X\\s*Samples|Coverage\\s*Based/i')
    .filter({ hasText: new RegExp(techniqueName, 'i') });

  if (await this.clickFirstVisible(option, 4000)) {
    return;
  }

  const optionInMenu = this.page
    .locator('[role="option"], [role="menuitem"], [data-radix-select-item], [cmdk-item]')
    .filter({ hasText: new RegExp(techniqueName, 'i') });

  if (await this.clickFirstVisible(optionInMenu, 4000)) {
    return;
  }

  throw new Error(`Sampling technique option not found: ${techniqueName}`);
 }

 async openSampling(fsliName = 'Property, Plant and Equipment') {
  await this.page.getByRole('button', { name: 'Workpapers' }).click();
  await this.page
   .locator(`xpath=//*[normalize-space()=${JSON.stringify(fsliName)}]/preceding-sibling::button[1]`)
    .first().click();

  await this.page.getByRole('button', { name: 'Planning' }).nth(1).click()
  await this.page.getByText('SAMPLING').click();
  await this.page.waitForLoadState('networkidle');
  const samplingHeading = this.page.getByRole('heading', { name: /Sampling/i }).first();
  if (await samplingHeading.isVisible().catch(() => false)) {
    await samplingHeading.waitFor({ state: 'visible', timeout: 10000 });
  }

  const samplingLabel = this.page.getByText(/^SAMPLING$/i).first();
  const samplingCard = samplingLabel.locator(
    'xpath=ancestor::*[.//button[normalize-space()="Start"]][1]'
  );
  const samplingStartButton = samplingCard.getByRole('button', { name: /^Start$/i }).first();

  await samplingStartButton.waitFor({ state: 'visible', timeout: 15000 });
  await samplingStartButton.click();

  const dataSourcePicker = this.page.getByText('Choose a data source', { exact: true }).first();
  await dataSourcePicker.waitFor({ state: 'visible', timeout: 15000 });
  await dataSourcePicker.click();

  const generalLedgerText = this.page.getByText('General Ledger', { exact: false }).first();
  await generalLedgerText.waitFor({ state: 'visible', timeout: 10000 });
  await generalLedgerText.click();
  await this.page.getByRole('button', { name: 'Continue' }).click();
}
  
  async topXtechnique() {
  await this.chooseTechnique('Top X Samples');
  await this.page.getByPlaceholder('Enter number').click();
  await this.page.getByPlaceholder('Enter number').fill('5');
  await this.page.getByPlaceholder('Enter number').press('Tab');
  await this.page.getByRole('button', { name: 'Load Samples' }).press('Enter');
  await this.page.getByRole('button', { name: 'Load Samples' }).click();
  await this.page.waitForTimeout(2000);
  await this.page.getByRole('button', { name: 'Continue' }).click();
  await this.page.getByRole('button', { name: 'Edit' }).click();
  await this.page.getByPlaceholder('Enter count').click();
  await this.page.getByPlaceholder('Enter count').fill('5');
  await this.page.getByRole('button', { name: 'Generate Samples' }).click();
  await this.page.waitForTimeout(2000);
  await this.page.getByRole('button', { name: 'Continue' }).click();
  await this.page.getByRole('button', { name: 'Non-Statistical' }).click();
  await this.page.getByRole('button', { name: 'Statistical', exact: true }).click()
  await this.page.waitForTimeout(2000);
  await this.page.getByRole('button', { name: 'Confirm' }).click();
  await this.page.getByText('Completed').click();
}
async abovethresholdtechnique() {
  await this.chooseTechnique('Above Threshold');
  await this.ensureActivePage();
  await this.page.getByPlaceholder('Enter Amount').click();
  await this.page.getByPlaceholder('Enter Amount').fill('790000');
  await this.page.getByPlaceholder('Enter Amount').press('Tab');
  await this.page.getByRole('button', { name: 'Load Samples' }).press('Enter')
  await this.page.getByRole('button', { name: 'Load Samples' }).click();
  await this.page.waitForTimeout(2000);
  await this.page.getByRole('button', { name: 'Continue' }).click();
  await this.page.getByRole('button', { name: 'Edit' }).click();
  await this.page.waitForTimeout(2000);
  await this.page.getByPlaceholder('Enter count').click();
  await this.page.getByPlaceholder('Enter count').click();
  await this.page.getByPlaceholder('Enter count').click();
  await this.page.getByPlaceholder('Enter count').click();
  await this.page.getByPlaceholder('Enter count').fill('10');
  await this.page.getByRole('button', { name: 'Generate Samples' }).click();
  await this.page.waitForTimeout(2000);
  await this.page.getByRole('button', { name: 'Continue' }).click();
  await this.page.getByRole('button', { name: 'Non-Statistical' }).click();
  await this.page.getByRole('button', { name: 'Statistical', exact: true }).click();
   await this.page.waitForTimeout(2000);
  await this.page.getByRole('button', { name: 'Confirm' }).click();
  await this.page.getByText('Completed').click();
}
async coveragebasedtechnique() {
  await this.chooseTechnique('Coverage Based');
  await this.ensureActivePage();
  await this.page.getByPlaceholder('Enter Percentage').click();
  await this.page.getByPlaceholder('Enter Percentage').fill('40');
  await this.page.getByPlaceholder('Enter Percentage').press('Tab');
  await this.page.getByRole('button', { name: 'Load Samples' }).press('Enter')
  await this.page.getByRole('button', { name: 'Load Samples' }).click();
  await this.page.waitForTimeout(4000);
  await this.page.getByRole('button', { name: 'Continue' }).click();
  await this.page.getByRole('button', { name: 'Edit' }).click();
  await this.page.waitForTimeout(4000);
  await this.page.getByPlaceholder('Enter count').click();
  await this.page.getByPlaceholder('Enter count').click();
  await this.page.getByPlaceholder('Enter count').click();
  await this.page.getByPlaceholder('Enter count').click();
  await this.page.getByPlaceholder('Enter count').fill('10');
  await this.page.getByRole('button', { name: 'Generate Samples' }).click();
  await this.page.waitForTimeout(4000);
  await this.page.getByRole('button', { name: 'Continue' }).click();
  await this.page.getByRole('button', { name: 'Non-Statistical' }).click();
  await this.page.getByRole('button', { name: 'Statistical', exact: true }).click();
  await this.page.waitForTimeout(4000);
  await this.page.getByRole('button', { name: 'Confirm' }).click();
  await this.page.getByText('Completed').click();
}
}

export default SamplingPage