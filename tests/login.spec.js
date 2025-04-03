const { test, expect } = require('@playwright/test');
const { allure } = require('@playwright/test');

test.describe('Login Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await test.step('Navigate to login page', async () => {
      try {
        await page.goto('/');
        await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 15000 });
      } catch (error) {
        console.error('Failed to load login page:', error);
        throw error;
      }
    });
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await test.step('Fill login credentials', async () => {
      try {
        await page.fill('input[type="email"]', 'test@kennect.io');
        await page.fill('input[type="password"]', 'Qwerty@1234');
      } catch (error) {
        console.error('Failed to fill login credentials:', error);
        throw error;
      }
    });

    await test.step('Submit login form', async () => {
      try {
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle' }),
          page.click('button[type="submit"], .login-button')
        ]);
      } catch (error) {
        console.error('Failed to submit login form:', error);
        throw error;
      }
    });

    await test.step('Verify successful login', async () => {
      try {
        await expect(page).toHaveURL(/.*dashboard/);
        await expect(page.locator('.dashboard-content, .main-content')).toBeVisible();
        await page.screenshot({ path: 'test-results/dashboard.png' });
      } catch (error) {
        console.error('Failed to verify successful login:', error);
        throw error;
      }
    });
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await test.step('Fill invalid credentials', async () => {
      try {
        await page.fill('input[type="email"]', 'invalid@example.com');
        await page.fill('input[type="password"]', 'wrongpassword');
      } catch (error) {
        console.error('Failed to fill invalid credentials:', error);
        throw error;
      }
    });

    await test.step('Submit login form', async () => {
      try {
        await page.click('button[type="submit"], .login-button');
      } catch (error) {
        console.error('Failed to submit login form:', error);
        throw error;
      }
    });

    await test.step('Verify error message', async () => {
      try {
        const errorMessage = await page.locator('.error-message, .alert-error').first();
        await expect(errorMessage).toBeVisible({ timeout: 10000 });
        await page.screenshot({ path: 'test-results/login-error.png' });
      } catch (error) {
        console.error('Failed to verify error message:', error);
        throw error;
      }
    });
  });
}); 