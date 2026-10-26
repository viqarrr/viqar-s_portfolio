import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';

if (!process.env.PLAYWRIGHT_BROWSERS_PATH && existsSync('D:/ms-playwright')) {
  process.env.PLAYWRIGHT_BROWSERS_PATH = 'D:/ms-playwright';
}

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  webServer: {
    command: 'npm.cmd run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:4321',
  },
});
