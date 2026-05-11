class MaterialityPage {
    constructor(page) {
        this.page = page;
    }

    async clickSelectButtonInUploadSlide() {
        const selectExact = this.page.getByRole('button', { name: 'Select (1)' });
        if (await selectExact.isVisible().catch(() => false)) {
            await this.page.waitForFunction(
                (button) => button && !button.disabled,
                await selectExact.elementHandle(),
                { timeout: 10000 }
            ).catch(() => {});
            await selectExact.click();
            return;
        }

        const selectAny = this.page.getByRole('button', { name: /^Select(\s*\(\d+\))?$/ });
        await selectAny.first().waitFor({ state: 'visible', timeout: 10000 });
        await this.page.waitForFunction(
            (button) => button && !button.disabled,
            await selectAny.first().elementHandle(),
            { timeout: 10000 }
        );
        await selectAny.first().click();
    }

    async areFilesPresentInFileManager(fileNames) {
        await this.page.getByRole('button', { name: 'File Manager' }).click();
        await this.page.waitForLoadState('networkidle').catch(() => {});
        await this.page.waitForTimeout(1000);

        const isPresentList = [];
        for (const fileName of fileNames) {
            const fileLocator = this.page.getByText(fileName, { exact: false }).first();
            isPresentList.push(await fileLocator.isVisible().catch(() => false));
        }

        await this.page.getByRole('button', { name: 'Planning' }).click().catch(() => {});
        await this.page.locator('a').filter({ hasText: 'Materiality' }).click().catch(() => {});
        await this.page.waitForLoadState('networkidle').catch(() => {});

        return isPresentList.every(Boolean);
    }

    async selectFileFromManagerOrUpload(filePath, fileName) {
        const slideUploadButton = this.page.getByRole('button', { name: 'Upload' }).last();
        await slideUploadButton.waitFor({ state: 'visible', timeout: 15000 });

        await this.page.waitForTimeout(2000);
        await this.page.waitForLoadState('networkidle').catch(() => {});

        const allRows = this.page.getByRole('row');
        await allRows.first().waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});

        const preferredRow = this.page.getByRole('row', { name: /Select row spreadsheet/i }).filter({ hasText: fileName }).first();
        const blockingOverlay = this.page.locator('div[data-state="open"][class*="fixed inset-0"][class*="bg-black/80"]');

        if ((await preferredRow.count()) > 0) {
            const selectRowCheckbox = preferredRow.getByRole('checkbox', { name: /Select row/i }).first();
            await blockingOverlay.first().waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
            await selectRowCheckbox.click({ force: true }).catch(async () => {
                await preferredRow.getByLabel(/Select row/i).first().click({ force: true });
            });

            const selectAny = this.page.getByRole('button', { name: /^Select(\s*\(\d+\))?$/ }).first();
            await this.page.waitForFunction(
                (button) => button && !button.disabled,
                await selectAny.elementHandle(),
                { timeout: 10000 }
            ).catch(() => {});
            return;
        }

        await slideUploadButton.waitFor({ state: 'visible', timeout: 10000 });
        await slideUploadButton.click();

        const browseFilesButton = this.page.getByRole('button', { name: 'Browse Files' });
        await browseFilesButton.waitFor({ state: 'visible', timeout: 15000 });

        const [fileChooser] = await Promise.all([
            this.page.waitForEvent('filechooser'),
            browseFilesButton.click(),
        ]);
        await fileChooser.setFiles(filePath);

        await this.page.getByRole('button', { name: 'Upload' }).click();
        await this.page.waitForLoadState('networkidle');
        await this.selectUploadedRow(fileName, 120000);
    }
async selectClient(clientName, engagementName) {
    // Click Clients button
    await this.page.getByRole('button', { name: 'Clients', exact: true }).click();

    // Scope to Clients container (dropdown / sidebar / modal)
    const clientsContainer = this.page.locator('(//div[contains(@class,"flex h-full")])[2]')
        .filter({ has: this.page.getByText('Clients', { exact: true }) });

    // Select first visible client match inside Clients container
    const client = clientsContainer.getByText(clientName, { exact: true }).first();
    await client.click();
    await this.page.waitForTimeout(2000);

    // Now scope engagement under the selected client
    const engagementContainer = this.page.locator('(//div[contains(@class,"flex h-full")])[2]', {
        has: this.page.getByText('Engagements', { exact: true })
    });
    const engagement = engagementContainer.getByText(engagementName, { exact: true }).first();
    await engagement.click();
    
}

    async openMateriality() {
        await this.page.getByRole('button', { name: 'Planning' }).click();
        await this.page.waitForTimeout(2000);
        await this.page.locator('a').filter({ hasText: 'Materiality' }).click();
        await this.page.waitForTimeout(2000);
    }

    async uploadGeneralLedger(filePath, fileName) {
        await this.page.locator('div').filter({ hasText: 'General Ledger *' }).getByRole('button', { name: 'Upload' }).first().click();
        await this.selectFileFromManagerOrUpload(filePath, fileName);
        await this.clickSelectButtonInUploadSlide();
        await this.page.locator('div').filter({ hasText: 'Account Name' }).nth(5).click();
        await this.page.getByText('Company').click();
        await this.page.locator('div').filter({ hasText: 'Source Number' }).nth(5).click();
        const slNoOption = this.page.getByText('Sl No').first();
        const sNoOption = this.page.getByText('S.No').first();
        if (await slNoOption.isVisible().catch(() => false)) {
            await slNoOption.click();
        } else {
            await sNoOption.click();
        }
        await this.page.locator('div').filter({ hasText: /^-$/ }).nth(5).click();
        await this.page.getByText('Journal Doc No').click();
        await this.page.locator('div').filter({ hasText: /^-$/ }).nth(5).click();
        await this.page.getByText('Je Category').click();
        await this.page.locator('div').filter({ hasText: /^-$/ }).nth(5).click();
        await this.page.getByText('BS/ PL').click();
        await this.page.getByText('Financial Statement Line Item Category*-').click();
        await this.page.locator('div').filter({ hasText: /^-$/ }).nth(5).click();
        await this.page.getByText('Category of FSLI').click();
        await this.page.locator('div').filter({ hasText: /^-$/ }).nth(5).click();
        await this.page.getByText('FSLI', { exact: true }).click();
        await this.page.locator('div').filter({ hasText: /^-$/ }).nth(5).click();
        await this.page.getByText('GL Account Code').click();
        await this.page.locator('div').filter({ hasText: /^-$/ }).nth(5).click();
        await this.page.getByText('Account Name', { exact: true }).click();
        await this.page.locator('div').filter({ hasText: /^-$/ }).nth(5).click();
        await this.page.getByText('Accounted Dr SUM').click();
        await this.page.locator('div').filter({ hasText: /^-$/ }).nth(5).click();
        await this.page.getByText('Accounted Cr SUM').click();
        await this.page.getByRole('button', { name: 'Validate Ledger' }).click();
        await this.page.getByText('Verifying the mapped columns').click();
        await this.page.getByText('Validated', { exact: true }).click();
    }

    async uploadTrialBalance(filePath, fileName) {
        await this.page.locator('div').filter({ hasText: 'Trial Balance *' }).getByRole('button', { name: 'Upload' }).first().click();
        await this.page.waitForTimeout(2000);
        await this.selectFileFromManagerOrUpload(filePath, fileName);
        await this.clickSelectButtonInUploadSlide();
        await this.page.locator('div').filter({ hasText: /^-$/ }).nth(5).click();
        await this.page.getByText('Category of FSLI').click();
        await this.page.locator('div').filter({ hasText: /^-$/ }).nth(5).click();
        await this.page.getByText('FSLI', { exact: true }).click();
        await this.page.getByRole('button', { name: 'Validate Balance' }).click();
        // await this.page.locator('div').filter({ hasText: /^-$/ }).nth(5).click();
        // await this.page.getByText('BS/ PL').click();
        // await this.page.locator('div').filter({ hasText: /^-$/ }).nth(5).click();
        // await this.page.getByText('Category of FSLI').click();
        // await this.page.locator('div').filter({ hasText: /^-$/ }).nth(5).click();
        // await this.page.getByText('FSLI', { exact: true }).click();
        // await this.page.locator('div').filter({ hasText: /^-$/ }).nth(5).click();
        // await this.page.getByText('GL Account Code').click();
        // await this.page.locator('div').filter({ hasText: /^-$/ }).nth(5).click();
        // await this.page.getByText('Sum of Accounted Dr SUM').click();
        // await this.page.locator('div').filter({ hasText: /^-$/ }).nth(5).click();
        // await this.page.getByText('Sum of Accounted Cr SUM').click();
        // await this.page.getByRole('button', { name: 'Validate Balance' }).click();
    
    }

    async submitMateriality() {
        await this.page.waitForTimeout(2000);
        await this.page.getByRole('button', { name: 'Submit' }).click();
        await this.page.waitForTimeout(2000);
        await this.page.getByRole('button', { name: 'Submit' }).click();
    }

    async selectUploadedRow(fileName, timeoutMs = 60000) {
        if (this.page.isClosed()) {
            throw new Error('Page was closed before uploaded rows became visible.');
        }

        await this.page.waitForLoadState('networkidle');
        const anyRow = this.page.getByRole('row', { name: /Select row spreadsheet/i });
        await anyRow.first().waitFor({ state: 'visible', timeout: timeoutMs });

        const matchingRow = anyRow.filter({ hasText: fileName }).first();
        const rowToClick = (await matchingRow.count()) > 0 ? matchingRow : anyRow.first();

        await rowToClick.getByLabel('Select row').click();
    }

    async areFilesUploaded() {
        const validatedLabels = this.page.locator('text=/Document validated|Validated/i');
        return (await validatedLabels.count()) >= 2;
    }

    async submitOrEditIfFilesUploaded() {
        const isUploaded = await this.areFilesUploaded();
        if (!isUploaded) {
            return false;
        }

        const submitButton = this.page.getByRole('button', { name: 'Submit' });
        const editButton = this.page.getByRole('button', { name: 'Edit' });

        if (await submitButton.isVisible()) {
            await submitButton.click();
            await submitButton.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
            if (await submitButton.isVisible()) {
                await submitButton.click();
            }
            return true;
        }

        if (await editButton.isVisible()) {
            await editButton.click();
            await editButton.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
            if (await editButton.isVisible()) {
                await editButton.click();
            }
            return true;
        }

        return false;
    }
    async removeGLanfTBfiles() {
        const removeFileIcon = this.page.locator('.w-full > .flex.items-center.justify-between > .lucide');
        await this.page.waitForTimeout(2000);
        const confirmButton = this.page.getByRole('button', { name: 'Confirm' });
        const blockingOverlay = this.page.locator('div[data-state="open"][class*="fixed inset-0"][class*="bg-black/80"]');

        for (let i = 0; i < 2; i++) {
            if ((await removeFileIcon.count()) === 0) {
                break;
            }

            await blockingOverlay.first().waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
            await removeFileIcon.first().click();
            await confirmButton.waitFor({ state: 'visible', timeout: 10000 });
            await confirmButton.click();
            await blockingOverlay.first().waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
            await this.page.waitForLoadState('networkidle').catch(() => {});
        }
    }
}

module.exports = MaterialityPage;
