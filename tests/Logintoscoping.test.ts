import { test } from "../fixtures/fixtures";
import {username,password} from "../utils/utils"
test('Login page to scoping', async ({ page,loginPage,riskAssessmentPage,scopingPage,materialityPage,samplingPage }: any) => {
  test.setTimeout(1300000);
  await loginPage.goto(); // fixed
  await loginPage.setZoom(0.98);
  await loginPage.login(username, password);
  const clientName = "Nanda Inc";
  const engagementName = "Testing 1";
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
    "./test-data/GL Data set 1 for SPPIN - FY 21-22 workpaper.xlsx";
  await materialityPage.uploadGeneralLedger(
    uploadFilePath,
    glFileName
  );

  const uploadFilePath2 =
    "./test-data/TB set 1 for SPPIN - FY 21-22 workpaper.xlsx";
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
  const fsliname = ['Bank charges', 'Borrowings and Debt', 'Trade Payables'];
  await scopingPage.openScoping(fsliname);
  
  await page.waitForTimeout(3000);  await page.close();
 
  });
