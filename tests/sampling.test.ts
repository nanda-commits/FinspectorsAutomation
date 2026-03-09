import { test } from "@playwright/test";
import LoginPage from "../pageObject/loginpage";
import MaterialityPage from "../pageObject/materialitypage";
import RiskAssessmentPage from "../pageObject/riskAssessment";
import ScopingPage from "../pageObject/scopingpage";
import SamplingPage from "../pageObject/samplingpage";

test('Sampling Test', async ({ page }) => {
  test.setTimeout(1200000);
  const materialityPage = new MaterialityPage(page);
  const loginPage = new LoginPage(page);
  const riskAssessmentPage = new RiskAssessmentPage(page);
  const scopingPage = new ScopingPage(page);
  const samplingPage = new SamplingPage(page);
  await loginPage.goto(); // fixed
  await loginPage.setZoom(0.98);
  await loginPage.login('nanda+04@finspectors.ai', 'Brave@3333');
  const clientName = "Git Inc";
  const engagementName = "Testing 1";
  await materialityPage.selectClient(clientName, engagementName);
  const samplingFsliName = "Employee Benefits";
  await samplingPage.openSampling(samplingFsliName);
  //await samplingPage.topXtechnique();  
  //await samplingPage.abovethresholdtechnique();
  await samplingPage.coveragebasedtechnique();
});