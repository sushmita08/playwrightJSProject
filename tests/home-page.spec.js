const { test, expect } = require('@playwright/test');
const { allure } = require('@playwright/test');

test.describe('Home Page', () => {
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
        await expect(page).toHaveURL(/.*dashboard/);
      } catch (error) {
        console.error('Failed to login:', error);
        throw error;
      }
    });
  });

  test('should display dashboard after login', async ({ page }) => {
    await test.step('Verify dashboard content', async () => {
      try {
        await expect(page.locator('.dashboard-content, .main-content')).toBeVisible();
        await expect(page.locator('nav, .navigation')).toBeVisible();
        await page.screenshot({ path: 'test-results/dashboard-view.png' });
      } catch (error) {
        console.error('Failed to verify dashboard content:', error);
        throw error;
      }
    });
  });

  test('should navigate to cost calculator', async ({ page }) => {
    await test.step('Navigate to cost calculator', async () => {
      try {
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle' }),
          page.click('text=Cost Calculator, a[href*="calculator"]')
        ]);
      } catch (error) {
        console.error('Failed to navigate to cost calculator:', error);
        throw error;
      }
    });

    await test.step('Verify calculator page', async () => {
      try {
        await expect(page).toHaveURL(/.*calculator/);
        await expect(page.locator('.calculator-form, form')).toBeVisible();
        await page.screenshot({ path: 'test-results/calculator-view.png' });
      } catch (error) {
        console.error('Failed to verify calculator page:', error);
        throw error;
      }
    });
  });

  test('should navigate to patient list', async ({ page }) => {
    await test.step('Navigate to patient list', async () => {
      try {
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle' }),
          page.click('text=Patients, a[href*="patients"]')
        ]);
      } catch (error) {
        console.error('Failed to navigate to patient list:', error);
        throw error;
      }
    });

    await test.step('Verify patient list page', async () => {
      try {
        await expect(page).toHaveURL(/.*patients/);
        await expect(page.locator('table, .patient-list')).toBeVisible();
        await page.screenshot({ path: 'test-results/patients-view.png' });
      } catch (error) {
        console.error('Failed to verify patient list page:', error);
        throw error;
      }
    });
  });

  test('should display test requests', async ({ page }) => {
    await test.step('Check test requests section', async () => {
      try {
        await expect(page.locator('.test-requests, .requests-section')).toBeVisible();
        const requests = await page.$$('.test-request, .request-item');
        await page.screenshot({ path: 'test-results/requests-view.png' });
      } catch (error) {
        console.error('Failed to check test requests:', error);
        throw error;
      }
    });
  });

  test('should update test request status', async ({ page }) => {
    await test.step('Find and update test request', async () => {
      try {
        const pendingRequest = await page.locator('.test-request:has-text("Pending"), .request-item:has-text("Pending")').first();
        await expect(pendingRequest).toBeVisible();
        
        await pendingRequest.locator('select, .status-select').selectOption('Completed');
        await expect(pendingRequest).toHaveText(/Completed/);
        
        await page.screenshot({ path: 'test-results/updated-request.png' });
      } catch (error) {
        console.error('Failed to update test request:', error);
        throw error;
      }
    });
  });
}); 