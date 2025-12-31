import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 5,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['html'], ['github']] : 'html',
  timeout: 60000,
  use: {
    baseURL: 'https://parabank.parasoft.com',
    trace: 'on-first-retry',
  },
  expect: {
    timeout: 15000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
