class RequestFlowPage {
  constructor(page) {
    this.page = page;
  }
  
    async createAndSendRequest({
    requestName,
    sectionName,
    documentName,
    folderName,
    excollabName,
    saName,
    mcqName,
    option1,
    option2
  }) {
    await this.page.getByRole('button', { name: 'Requests' }).click();
    const createRequestInGrid = this.page.getByRole('grid').getByRole('button', { name: 'Create new request' }).first();
    const createRequestButton = this.page.getByRole('button', { name: 'Create new request' }).first();
    if (await createRequestInGrid.isVisible().catch(() => false)) {
      await createRequestInGrid.click();
    } else {
      await createRequestButton.waitFor({ state: 'visible', timeout: 20000 });
      await createRequestButton.click();
    }
    await this.page.getByText('Create from ScratchCreate a').click();

    const requestNameInput = this.page.getByRole('textbox', { name: 'Untitled request' }).first();
    if (!(await requestNameInput.isVisible().catch(() => false))) {
      const requestPencil = this.page.locator('.lucide.lucide-pencil').first();
      await requestPencil.waitFor({ state: 'visible', timeout: 10000 });
      await requestPencil.click().catch(async () => {
        await requestPencil.click({ force: true });
      });
    }
    await requestNameInput.fill(requestName);

    const sectionPencil = this.page.locator('.lucide.lucide-pencil.w-\\[0\\.75rem\\]').first();
    await sectionPencil.waitFor({ state: 'visible', timeout: 10000 });
    await sectionPencil.click().catch(async () => {
      await sectionPencil.click({ force: true });
    });
    await this.page.getByRole('textbox', { name: 'Untitled section' }).first().fill(sectionName);
    await this.page.waitForTimeout(1000);
    await this.page.getByText('DocumentSave to Folder:').click();
    await this.page.getByRole('button', { name: 'Add Task' }).click();
    await this.page.getByText('DocumentSave to Folder:').nth(1).click();
    await this.page.getByRole('button', { name: 'Add Task' }).click();

    await this.page.getByRole('textbox', { name: 'Enter document name' }).first().click();
    await this.page.getByRole('textbox', { name: 'Enter document name' }).first().fill(documentName);

    await this.page.getByRole('button', { name: 'Root' }).first().click();
    await this.page.getByRole('button', { name: 'Create New Folder' }).click();
    await this.page.getByRole('textbox', { name: 'Enter folder name' }).click();
    await this.page.getByRole('textbox', { name: 'Enter folder name' }).fill(folderName);
    await this.page.getByRole('button', { name: 'Create' }).click();
    await this.page.getByRole('gridcell', { name: `folder ${folderName}` }).click();
    await this.page.getByRole('button', { name: 'Select Folder' }).click();
    await this.page.waitForTimeout(2000);
    await this.page
      .locator(
        '.w-full.rounded-\\[8px\\].border.p-\\[1rem\\].flex.flex-col.gap-\\[1rem\\].cursor-pointer.transition-all.duration-200.bg-background-light.dark\\:bg-background-dark.border-border-light > .w-full.flex.items-center.justify-between > .relative > .justify-between'
      )
      .first()
      .click();
    await this.page.locator('div').filter({ hasText: /^Short Answer$/ }).nth(1).click();

    await this.page.getByRole('textbox', { name: 'Enter Question' }).click();
    await this.page.getByRole('textbox', { name: 'Enter Question' }).first().fill(saName);

    await this.page
      .locator('div:nth-child(4) > .w-full.flex.items-center.justify-between > .relative > .justify-between')
      .click();
    await this.page.locator('div').filter({ hasText: /^MCQ$/ }).first().click();

    await this.page.getByRole('textbox', { name: 'Enter Question' }).nth(1).click();
    await this.page.getByRole('textbox', { name: 'Enter Question' }).nth(1).fill(mcqName);

    await this.page.getByText('Option 1Option').click();
    await this.page.getByRole('textbox', { name: 'Enter Option' }).first().click();
    await this.page.getByRole('textbox', { name: 'Enter Option' }).first().click();
    await this.page.getByRole('textbox', { name: 'Enter Option' }).first().fill(option1);
    await this.page.getByRole('textbox', { name: 'Enter Option' }).first();

    await this.page
      .locator(
        '.inline-flex.items-center.justify-center.gap-2.whitespace-nowrap.rounded-\\[8px\\].font-geist-medium.font-medium.shadow-xs.transition-colors.cursor-pointer.outline-none.hover\\:bg-ghost-button-hovered.dark\\:hover\\:bg-ghost-button-hovered-dark.hover\\:text-ghost-button-hovered-stroke.dark\\:hover\\:text-ghost-button-hovered-stroke-dark.focus\\:outline-none.focus\\:ring-0.focus\\:bg-ghost-button-hovered.dark\\:focus\\:bg-ghost-button-hovered-dark.focus\\:text-ghost-button-hovered-stroke.dark\\:focus\\:text-ghost-button-hovered-stroke-dark.active\\:bg-ghost-button-pressed.dark\\:active\\:bg-ghost-button-pressed-dark.disabled\\:opacity-60.disabled\\:cursor-not-allowed.text-\\[0\\.75rem\\].h-8'
      )
      .first()
      .press('Tab');
    await this.page.locator('div:nth-child(2) > .flex.items-center.justify-start > .touch-none').first().press('Tab');
    await this.page.getByRole('textbox', { name: 'Enter Option' }).nth(1).fill(option2);

    await this.page.getByRole('button', { name: 'Save Request' }).click();
    const confirmSaveButton = this.page.locator('[role="dialog"]').getByRole('button', { name: /Yes, save it/i }).first();
    const fallbackConfirmSaveButton = this.page.getByRole('button', { name: /Yes, save it/i }).first();
    const shouldConfirmSave = await confirmSaveButton
      .waitFor({ state: 'visible', timeout: 8000 })
      .then(() => true)
      .catch(() => false);
    if (shouldConfirmSave) {
      await confirmSaveButton.click().catch(async () => {
        await confirmSaveButton.click({ force: true });
      });
    } else if (await fallbackConfirmSaveButton.isVisible().catch(() => false)) {
      await fallbackConfirmSaveButton.click().catch(async () => {
        await fallbackConfirmSaveButton.click({ force: true });
      });
    }

 const taskCheckbox = this.page.locator('[id^="cell-checkbox-"]').getByRole('checkbox').first(); 
 const waitForAssignButtonEnabled = async (timeoutMs = 15000) => {
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    if (this.page.isClosed()) {
      throw new Error('Page closed while waiting for Assign to button.');
    }
    const button = this.page.getByRole('button', { name: 'Assign to' }).first();
    const isVisible = await button.isVisible().catch(() => false);
    const isEnabled = await button.isEnabled().catch(() => false);
    if (isVisible && isEnabled) {
      return button;
    }
    await this.page.waitForTimeout(300).catch(() => {});
  }
  throw new Error('Assign to button did not become enabled in time.');
};
await taskCheckbox.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
await taskCheckbox.click().catch(async () => {
  await this.page.locator('[id^="cell-checkbox-"]').first().click({ force: true }).catch(() => {});
});
  const waitForDueDateButtonEnabled = async (timeoutMs = 10000) => {
    const startTime = Date.now();
    while (Date.now() - startTime < timeoutMs) {
      if (this.page.isClosed()) {
        throw new Error('Page closed while waiting for Due Date button.');
      }
      const dueDateButton = this.page.getByRole('button', { name: 'Due Date' }).first();
      const isVisible = await dueDateButton.isVisible().catch(() => false);
      const isEnabled = await dueDateButton.isEnabled().catch(() => false);
      if (isVisible && isEnabled) {
        return dueDateButton;
      }
      await this.page.waitForTimeout(300).catch(() => {});
    }
    throw new Error('Due Date button did not become enabled in time.');
  };
  const dueDateButton = await waitForDueDateButtonEnabled();
  await dueDateButton.click();
  await this.page.getByRole('button', { name: /^Today/i }).first().click();
  await taskCheckbox.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  await taskCheckbox.click().catch(async () => {
    await this.page.locator('[id^="cell-checkbox-"]').first().click({ force: true }).catch(() => {});
  });
  await this.page.waitForTimeout(2000);
  const assignButton = await waitForAssignButtonEnabled();
  await assignButton.click();
  const collaboratorOption = this.page.getByRole('option', { name: new RegExp(excollabName, 'i') }).first();
  await collaboratorOption.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});
  if (await collaboratorOption.isVisible().catch(() => false)) {
    await collaboratorOption.click();
  } else {
    await this.page.getByRole('option').first().click();
  }
await taskCheckbox.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
await taskCheckbox.click().catch(async () => {
  await this.page.locator('[id^="cell-checkbox-"]').first().click({ force: true }).catch(() => {});
});

    const finalSaveButton = this.page.getByRole('button', { name: 'Save Request' }).first();
    if (await finalSaveButton.isVisible().catch(() => false)) {
      await finalSaveButton.click().catch(() => {});
      const finalSaveConfirm = this.page.getByRole('button', { name: /Yes, save it/i }).first();
      if (await finalSaveConfirm.isVisible().catch(() => false)) {
        await finalSaveConfirm.click().catch(() => {});
      }
    }

    const sendRequestButton = this.page.getByRole('button', { name: 'Send Request' }).first();
    if (await sendRequestButton.isVisible().catch(() => false)) {
      if (await sendRequestButton.isDisabled().catch(() => true)) {
        await taskCheckbox.click().catch(async () => {
          await this.page.locator('[id^="cell-checkbox-"]').first().click({ force: true }).catch(() => {});
        });
      }
      await sendRequestButton.click().catch(() => {});
      const sendConfirmButton = this.page.getByRole('button', { name: 'Send' }).first();
      if (await sendConfirmButton.isVisible().catch(() => false)) {
        await sendConfirmButton.click().catch(() => {});
      }
    }
  }
}

module.exports = RequestFlowPage;
