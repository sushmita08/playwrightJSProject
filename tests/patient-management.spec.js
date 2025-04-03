const { test, expect } = require('@playwright/test');
const { allure } = require('@playwright/test');

test.describe('Patient Management', () => {
  test.beforeEach(async ({ page }) => {
    await test.step('Login to application', async () => {
      try {
        await page.goto('/');
        await expect(page.locator('input[type="email"]')).toBeVisible();
        await page.fill('input[type="email"]', 'test@kennect.io');
        await page.fill('input[type="password"]', 'Qwerty@1234');
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle' }),
          page.click('button[type="submit"], .login-button')
        ]);
      } catch (error) {
        console.error('Failed to login:', error);
        throw error;
      }
    });

    await test.step('Navigate to patient management', async () => {
      try {
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle' }),
          page.click('text=Patients, a[href*="patients"]')
        ]);
        await expect(page).toHaveURL(/.*patients/);
      } catch (error) {
        console.error('Failed to navigate to patient management:', error);
        throw error;
      }
    });
  });

  test('should display patient list', async ({ page }) => {
    await test.step('Verify patient list elements', async () => {
      try {
        await expect(page.locator('table, .patient-list')).toBeVisible();
        await expect(page.locator('button:has-text("Add Patient"), .add-patient-btn')).toBeVisible();
        
        const patientCount = await page.$$eval('tr, .patient-item', items => items.length);
        console.log(`Found ${patientCount} patients`);
        
        await page.screenshot({ path: 'test-results/patient-list.png' });
      } catch (error) {
        console.error('Failed to verify patient list:', error);
        throw error;
      }
    });
  });

  test('should add new patient', async ({ page }) => {
    await test.step('Open add patient form', async () => {
      try {
        await page.click('button:has-text("Add Patient"), .add-patient-btn');
        await expect(page.locator('form, .patient-form')).toBeVisible();
      } catch (error) {
        console.error('Failed to open add patient form:', error);
        throw error;
      }
    });

    await test.step('Fill patient details', async () => {
      try {
        await page.fill('input[name="name"], .patient-name', 'John Doe');
        await page.fill('input[name="age"], .patient-age', '30');
        await page.fill('input[name="phone"], .patient-phone', '1234567890');
        await page.fill('input[name="email"], .patient-email', 'john@example.com');
      } catch (error) {
        console.error('Failed to fill patient details:', error);
        throw error;
      }
    });

    await test.step('Submit patient form', async () => {
      try {
        await Promise.all([
          page.waitForResponse(response => response.url().includes('/patients') && response.status() === 200),
          page.click('button[type="submit"], .submit-patient')
        ]);
        
        await expect(page.locator('text=Patient added successfully, .success-message')).toBeVisible();
        await page.screenshot({ path: 'test-results/new-patient-added.png' });
      } catch (error) {
        console.error('Failed to submit patient form:', error);
        throw error;
      }
    });
  });

  test('should create test request', async ({ page }) => {
    await test.step('Open create test form', async () => {
      try {
        await page.click('button:has-text("Create Test"), .create-test-btn');
        await expect(page.locator('form, .test-form')).toBeVisible();
      } catch (error) {
        console.error('Failed to open test form:', error);
        throw error;
      }
    });

    await test.step('Fill test request details', async () => {
      try {
        await page.selectOption('select.patient-select, .patient-dropdown', { label: 'John Doe' });
        await page.selectOption('select.test-select, .test-dropdown', { label: 'Complete Blood Count' });
        await page.fill('textarea[name="notes"], .test-notes', 'Routine checkup');
      } catch (error) {
        console.error('Failed to fill test request details:', error);
        throw error;
      }
    });

    await test.step('Submit test request', async () => {
      try {
        await Promise.all([
          page.waitForResponse(response => response.url().includes('/tests') && response.status() === 200),
          page.click('button[type="submit"], .submit-test')
        ]);
        
        await expect(page.locator('text=Test request created successfully, .success-message')).toBeVisible();
        await page.screenshot({ path: 'test-results/test-request-created.png' });
      } catch (error) {
        console.error('Failed to submit test request:', error);
        throw error;
      }
    });
  });
}); 