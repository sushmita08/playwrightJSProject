# Playwright Test Project

This is a sample Playwright test project that demonstrates basic end-to-end testing capabilities.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

Run all tests:
```bash
npx playwright test
```

Run tests in a specific browser:
```bash
npx playwright test --project=chromium
```

Run tests in UI mode:
```bash
npx playwright test --ui
```

View test report:
```bash
npx playwright show-report
```

## Project Structure

- `tests/` - Contains all test files
- `playwright.config.js` - Playwright configuration
- `package.json` - Project dependencies and scripts

## Writing Tests

Tests are written using the Playwright Test framework. See the example test in `tests/example.spec.js` for a basic example.

## Documentation

For more information, visit:
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright Test Documentation](https://playwright.dev/docs/test-intro) 