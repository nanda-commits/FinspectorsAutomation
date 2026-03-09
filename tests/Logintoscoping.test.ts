import { test } from "@playwright/test";
import LoginPage from "../pageObject/loginpage";
import MaterialityPage from "../pageObject/materialitypage";
import RiskAssessmentPage from "../pageObject/riskAssessment";
import ScopingPage from "../pageObject/scopingpage";
import SamplingPage from "../pageObject/samplingpage";

test('Login page to scoping', async ({ page }) => {
  test.setTimeout(1300000);

  const materialityPage = new MaterialityPage(page);
  const loginPage = new LoginPage(page);
  const riskAssessmentPage = new RiskAssessmentPage(page);
  const scopingPage = new ScopingPage(page);
  const samplingPage = new SamplingPage(page);
  await loginPage.goto(); // fixed
  await loginPage.setZoom(0.98);
  await loginPage.login('nanda+04@finspectors.ai', 'Brave@3333');

  const clientName = "Git Inc";
  const engagementName = "Testing 3";
  await materialityPage.selectClient(clientName, engagementName);
  await materialityPage.openMateriality();
  //Unsupervised Data set 2 - Linkeded Workpaper col.xlsx
  //Unsupervised Data Set 2 _ TB.xlsx
  //GL Data set 1 for SPPIN - FY 21-22 workpaper.xlsx
  //TB set 1 for SPPIN - FY 21-22 workpaper.xlsx
  //GL Data set 1 for SPPIN - FY 21-22 (2).xlsx
  //TB set 1 for SPPIN - FY 21-22 (2).xlsx

  const glFileName = "GL Data set 1 for SPPIN - FY 21-22 workpaper.xlsx";
  const tbFileName = "TB set 1 for SPPIN - FY 21-22 workpaper.xlsx";
  const uploadFilePath =
    "./tests/fixtures/GL Data set 1 for SPPIN - FY 21-22 workpaper.xlsx";
  await materialityPage.uploadGeneralLedger(
    uploadFilePath,
    glFileName
  );

  const uploadFilePath2 =
    "./tests/fixtures/TB set 1 for SPPIN - FY 21-22 workpaper.xlsx";
  await materialityPage.uploadTrialBalance(
    uploadFilePath2,
    tbFileName
  );
  // await page.waitForTimeout(5000);
  // await materialityPage.removeGLanfTBfiles();
  await materialityPage.submitMateriality();
  await riskAssessmentPage.openRiskAssessment();
  await riskAssessmentPage.configureRiskAssessment();
  await riskAssessmentPage.waitForValidationComplete();
  await riskAssessmentPage.reviewFsliTable();
  await riskAssessmentPage.reviewTransactions();
  await riskAssessmentPage.submitAssessment();
  await scopingPage.openScoping();
  const fsliname = ['Bank charges', 'Leases', 'Borrowings and Debt', 'Trade Payables'];
  await scopingPage.openScoping(fsliname);

});
