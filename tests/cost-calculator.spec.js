const { test, expect } = require('@playwright/test');
const { allure } = require('@playwright/test');

test.describe('Cost Calculator', () => {
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

    await test.step('Navigate to cost calculator', async () => {
      try {
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle' }),
          page.click('text=Cost Calculator, a[href*="calculator"]')
        ]);
        await expect(page).toHaveURL(/.*calculator/);
      } catch (error) {
        console.error('Failed to navigate to calculator:', error);
        throw error;
      }
    });
  });

  test('should display cost calculator form', async ({ page }) => {
    await test.step('Verify calculator elements', async () => {
      try {
        await expect(page.locator('.calculator-form, form')).toBeVisible();
        await expect(page.locator('select, .test-select')).toBeVisible();
        await expect(page.locator('input[type="number"], .discount-input')).toBeVisible();
        await page.screenshot({ path: 'test-results/calculator-form.png' });
      } catch (error) {
        console.error('Failed to verify calculator elements:', error);
        throw error;
      }
    });
  });

  test('should calculate test costs', async ({ page }) => {
    await test.step('Select test and get cost', async () => {
      try {
        await page.selectOption('select, .test-select', { label: 'Complete Blood Count' });
        await expect(page.locator('.test-cost, .amount')).toBeVisible();
        const cost = await page.locator('.test-cost, .amount').textContent();
        await page.screenshot({ path: 'test-results/test-cost.png' });
      } catch (error) {
        console.error('Failed to calculate test cost:', error);
        throw error;
      }
    });
  });

  test('should apply discount', async ({ page }) => {
    await test.step('Calculate discounted cost', async () => {
      try {
        await page.selectOption('select, .test-select', { label: 'Complete Blood Count' });
        await expect(page.locator('.test-cost, .amount')).toBeVisible();
        const originalCost = await page.locator('.test-cost, .amount').textContent();

        await page.fill('input[type="number"], .discount-input', '10');
        await page.click('button:has-text("Apply"), .apply-discount');

        await expect(page.locator('.discounted-cost, .final-amount')).toBeVisible();
        const discountedCost = await page.locator('.discounted-cost, .final-amount').textContent();
        
        await page.screenshot({ path: 'test-results/discounted-cost.png' });
      } catch (error) {
        console.error('Failed to apply discount:', error);
        throw error;
      }
    });
  });

  test('should add multiple tests', async ({ page }) => {
    await test.step('Add multiple tests', async () => {
      try {
        // Add first test
        await page.selectOption('select, .test-select', { label: 'Complete Blood Count' });
        await page.click('button:has-text("Add"), .add-test');

        // Add second test
        await page.selectOption('select, .test-select', { label: 'Lipid Profile' });
        await page.click('button:has-text("Add"), .add-test');

        // Verify tests are added
        await expect(page.locator('.test-items, .selected-tests')).toBeVisible();
        const testItems = await page.$$('.test-item');
        expect(testItems.length).toBeGreaterThanOrEqual(2);

        await page.screenshot({ path: 'test-results/multiple-tests.png' });
      } catch (error) {
        console.error('Failed to add multiple tests:', error);
        throw error;
      }
    });
  });
}); 