import { test as base } from '@playwright/test';
import LoginPage from "../pageObject/loginpage";
import MaterialityPage from "../pageObject/materialitypage";
import RiskAssessmentPage from "../pageObject/riskAssessment";
import ScopingPage from "../pageObject/scopingpage";
import SamplingPage from "../pageObject/samplingpage";
import {username,password} from "../utils/utils"
export const test = base.extend({

    loginPage: async ({ page, browser }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    loggedBrowserPage: async ({ page, browser }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto(); // fixed
        await loginPage.setZoom(0.98);
        await loginPage.login(username, password);
        await use(page);
    },

    materialityPage: async ({ page, browser }, use) => {
        const materialityPage = new MaterialityPage(page);
        await use(materialityPage);
    },

    riskAssessmentPage: async ({ page, browser }, use) => {
        const riskAssessmentPage = new RiskAssessmentPage(page);
        await use(riskAssessmentPage);
    },

    scopingPage: async ({ page, browser }, use) => {
        const scopingPage = new ScopingPage(page);
        await use(scopingPage);
    },

    samplingPage: async ({ page, browser }, use) => {
        const samplingPage = new SamplingPage(page);
        await use(samplingPage);
    },
    blockedStatusUserDetails: async ({ }, use) => {
        await use(USERS.BLOCKED_STATUS_USER)
    }, blankPage: async ({ page }, use) => {
        await use(page);
    }, adminPage: async ({ browser }, use) => {
        const context = await browser.newContext({
            storageState: 'storage/admin.json',
        });
        const page = await context.newPage();
        await use(page);
        await context.close();
    },

    clientPage: async ({ browser }, use) => {
        const context = await browser.newContext({
            storageState: 'storage/client.json',
        });
        const page = await context.newPage();
        await use(page);
        await context.close();
    },

});