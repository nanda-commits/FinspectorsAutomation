const { expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

class ExtCollabPage {
  constructor(page) {
    this.page = page;
  }

  ensureUploadFilesExist(fileNames) {
    const createdFiles = [];
    for (const fileName of fileNames) {
      const fullPath = path.resolve(process.cwd(), fileName);
      if (!fs.existsSync(fullPath)) {
        fs.writeFileSync(fullPath, 'placeholder upload content', 'utf8');
      }
      createdFiles.push(fullPath);
    }
    return createdFiles;
  }

  async openEngagementAndVerifyRequest({
    exclientName,
    exengagementName,
    exrequestName,
  }) {
    await this.page.locator('(//button[@aria-expanded="false"])[2]').click();

    const clientHeader = this.page.locator(`text=${exclientName}`).first();
    await clientHeader.scrollIntoViewIfNeeded();
    await expect(clientHeader).toBeVisible();

    const escapedEngagement = exengagementName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const targetEngagement = clientHeader
      .locator('xpath=following::div[@role="menuitem" and normalize-space()="' + exengagementName + '"]')
      .first();

    const engagementVisible = await targetEngagement.isVisible().catch(() => false);
    if (engagementVisible) {
      await targetEngagement.click();
    } else {
      await this.page.getByRole('menuitem', { name: exengagementName, exact: true }).first().click();
    }

    await this.page.waitForTimeout(1500);

    const requestRow = this.page
      .getByRole('row', { name: new RegExp(escapedEngagement + '|' + exrequestName, 'i') })
      .filter({ hasText: new RegExp(exrequestName, 'i') })
      .first();

    await expect(requestRow).toBeVisible({ timeout: 15000 });
    await requestRow.click();
    await expect(requestRow).toContainText(exrequestName);
    await this.page.waitForTimeout(1000);
  }
  async submitChecklist({ documentName, saName, mcqName, opt2 }) {
    await this.page.getByText(documentName).click();
  await this.page.getByRole('button', { name: 'Upload' }).click();
  const browseFilesButton = this.page.getByRole('button', { name: 'Browse Files' });
  const [fileChooser] = await Promise.all([
    this.page.waitForEvent('filechooser'),
    browseFilesButton.click(),
  ]);
  const uploadFiles = this.ensureUploadFilesExist([
    'TB set 1 for SPPIN - FY 21-22 (2).xlsx',
    'GL Data set 1 for SPPIN - FY 21-22 (2).xlsx',
  ]);
  await fileChooser.setFiles(uploadFiles);
  await this.page.getByRole('button', { name: 'Upload' }).click();
  await this.page.getByRole('button', { name: 'Submit', exact: true }).click();
   await this.page.waitForTimeout(2000);
  await this.page.getByText(saName).click();
  await this.page.getByRole('textbox', { name: 'Add response' }).click();
  await this.page.getByRole('textbox', { name: 'Add response' }).fill('General ledger contain all the transaction not in a sheet and Trail balance is an short summary of general ledger');
  await this.page.getByRole('button', { name: 'Submit', exact: true }).click();
  await this.page.waitForTimeout(2000);
  await this.page.getByText(mcqName).click();
  await this.page.getByRole('radio', { name: opt2 + ' *' }).first().click();
  await this.page.getByRole('button', { name: 'Submit', exact: true }).click();
  }
}

module.exports = ExtCollabPage;
