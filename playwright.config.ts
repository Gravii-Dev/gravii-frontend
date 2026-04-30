import { defineConfig, devices } from '@playwright/test'

const reuseExistingServer = process.env.PLAYWRIGHT_REUSE_EXISTING_SERVER === 'true'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  use: {
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      }
    }
  ],
  webServer: [
    {
      command: 'cd apps/gravii-user-landing && bun run dev',
      reuseExistingServer,
      timeout: 180_000,
      url: 'http://localhost:3000'
    },
    {
      command: 'cd apps/gravii-partner-app && bun run dev',
      reuseExistingServer,
      timeout: 180_000,
      url: 'http://localhost:3001'
    },
    {
      command: 'cd apps/gravii-user-app && bun run dev',
      reuseExistingServer,
      timeout: 180_000,
      url: 'http://localhost:3003'
    },
    {
      command: 'cd apps/gravii-backoffice && bun run dev',
      reuseExistingServer,
      timeout: 180_000,
      url: 'http://localhost:3004'
    }
  ]
})
