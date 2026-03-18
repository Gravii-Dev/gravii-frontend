import { expect, test, type Page } from '@playwright/test'

const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:3001'

function attachRuntimeWatch(page: Page) {
  const pageErrors: string[] = []
  const consoleErrors: string[] = []

  page.on('pageerror', (error) => {
    pageErrors.push(error.message)
  })

  page.on('console', (message) => {
    if (message.type() !== 'error') {
      return
    }

    const text = message.text()

    if (text.includes('favicon.ico')) {
      return
    }

    consoleErrors.push(text)
  })

  return () => {
    expect(pageErrors, `page errors: ${pageErrors.join('\n')}`).toEqual([])
    expect(consoleErrors, `console errors: ${consoleErrors.join('\n')}`).toEqual([])
  }
}

async function openScenario(page: Page, label: RegExp) {
  await page.goto(baseURL)
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: label }).click()
  await page.waitForLoadState('networkidle')
}

async function readEstimatedReach(page: Page) {
  const estimateText = await page
    .getByText(/Estimated reach/i)
    .locator('xpath=following-sibling::strong')
    .textContent()
  return Number((estimateText ?? '').replace(/[^\d]/g, ''))
}

test.describe.configure({ mode: 'serial' })

test('connect module controls mirror the original flow', async ({ page }) => {
  const assertNoRuntimeErrors = attachRuntimeWatch(page)

  await openScenario(page, /Expand with Gravii pool/i)

  await page.getByRole('button', { name: /Copy invite link/i }).click()
  await expect(page.getByRole('button', { name: /Copied link/i })).toBeVisible()
  await page.getByRole('button', { name: /Preview referral flow/i }).click()
  await expect(page.locator('main')).toContainText('Referral preview')

  await page.goto(`${baseURL}/connect?module=gate-api`)
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: /Reveal API key/i }).click()
  await expect(page.locator('main')).toContainText('grv_live_partner_4e72d0f8c2e1')

  await page.goto(`${baseURL}/connect?module=community-bot`)
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: /Connect Discord/i }).click()
  await page.getByRole('button', { name: /Connect Telegram/i }).click()
  await expect(page.locator('main')).toContainText('Discord')
  await expect(page.locator('main')).toContainText('Connected')
  await expect(page.locator('main')).toContainText('Telegram')

  await page.goto(`${baseURL}/connect?module=agent-api`)
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: /View example/i }).click()
  await expect(page.locator('main')).toContainText('POST /v1/agent/verify-condition')
  await page.getByRole('button', { name: /Request credits/i }).click()
  await expect(page.locator('main')).toContainText('Credits request queued for partner review.')

  assertNoRuntimeErrors()
})

test('analytics and labels controls react across dimensions and filter groups', async ({ page }) => {
  const assertNoRuntimeErrors = attachRuntimeWatch(page)

  await openScenario(page, /Expand with Gravii pool/i)
  await page.getByRole('link', { name: /User Analytics/i }).click()
  await page.waitForLoadState('networkidle')

  await expect(page.locator('main')).toContainText('301,012')
  await page.getByRole('button', { name: /By Region/i }).click()
  await page.getByRole('button', { name: /^US$/ }).click()
  await expect(page.locator('main')).not.toContainText('301,012')
  await page.getByRole('button', { name: /^Gold$/ }).click()
  await expect(page.locator('main')).toContainText('Gold · 90,304 users · Avg Portfolio $8,430')

  await page.getByRole('link', { name: /User Segments/i }).click()
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: /^ETH$/ }).click()
  await page.getByRole('button', { name: /DEX Traders/i }).click()
  await expect(page.locator('main')).toContainText('1 labels')
  await page.getByRole('button', { name: /≤ 7d/i }).click()
  await expect(page.locator('main')).toContainText('/mo')

  await page.getByRole('button', { name: /By Value/i }).click()
  await page.locator('main').getByRole('button', { name: /^gold$/i }).click()
  await page.locator('main').getByRole('button', { name: /^stables$/i }).click()
  await expect(page.locator('main')).toContainText('2 filters')
  await expect(page.locator('main')).not.toContainText('301,012 users')

  assertNoRuntimeErrors()
})

test('reach controls cover custom fields, access states, and estimation changes', async ({ page }) => {
  const assertNoRuntimeErrors = attachRuntimeWatch(page)

  await openScenario(page, /Discover new users/i)
  await expect(page.locator('main')).toContainText('Locked to discover new users.')

  await page.getByRole('button', { name: /By behavior/i }).click()
  const initialReach = await readEstimatedReach(page)
  await page.getByRole('button', { name: /Smart Saver/i }).click()
  await page.getByRole('button', { name: /Ethereum/i }).click()
  await page.getByRole('button', { name: /^US$/ }).click()
  const filteredReach = await readEstimatedReach(page)
  expect(filteredReach).toBeLessThan(initialReach)

  await page.getByLabel('Campaign type').selectOption('Custom')
  await expect(page.getByLabel('Custom type name')).toBeVisible()
  await page.getByLabel('CTA label').selectOption('Custom')
  await expect(page.getByLabel('Custom CTA text')).toBeVisible()

  await page.getByLabel('Access type').selectOption('invite')
  await expect(page.locator('main')).toContainText('INVITE ONLY')
  await expect(page.locator('main')).toContainText('REQUEST ACCESS')

  await page.getByLabel('Access type').selectOption('closed')
  await expect(page.locator('main')).toContainText('CLOSED')

  await page.getByRole('button', { name: /By value/i }).click()
  await page.getByRole('button', { name: /^Black$/ }).click()
  await expect(page.locator('main')).toContainText('Black+')

  assertNoRuntimeErrors()
})

test('settings toggles control sidebar exposure and direct-route fallback', async ({ page }) => {
  const assertNoRuntimeErrors = attachRuntimeWatch(page)

  await openScenario(page, /Expand with Gravii pool/i)
  await page.getByRole('link', { name: /Settings/i }).click()
  await page.waitForLoadState('networkidle')

  const analyticsRow = page.locator('div').filter({ hasText: /^User AnalyticsDASHBOARD surface/ }).first()
  const analyticsToggle = analyticsRow.getByRole('button')

  await expect(page.getByRole('link', { name: /User Analytics/i })).toBeVisible()
  await analyticsToggle.click()
  await expect(page.getByRole('link', { name: /User Analytics/i })).toHaveCount(0)

  await page.goto(`${baseURL}/analytics`)
  await page.waitForLoadState('networkidle')
  await expect(page).toHaveURL(/\/connect\?module=xray-link$/)

  await page.getByRole('link', { name: /Settings/i }).click()
  await page.waitForLoadState('networkidle')
  await analyticsToggle.click()
  await expect(page.getByRole('link', { name: /User Analytics/i })).toBeVisible()

  assertNoRuntimeErrors()
})

test('lens and risk controls complete their internal actions', async ({ page }) => {
  const assertNoRuntimeErrors = attachRuntimeWatch(page)

  await openScenario(page, /See your user pool/i)
  await page.getByRole('button', { name: /Upload sample CSV/i }).click()
  await expect(page.locator('main')).toContainText('Analysis report')
  await page.getByRole('link', { name: /Open dashboard/i }).click()
  await page.waitForLoadState('networkidle')
  await expect(page).toHaveURL(/\/dashboard$/)

  await page.goto(`${baseURL}/risk`)
  await page.waitForLoadState('networkidle')
  await page.getByRole('combobox').first().selectOption('critical')
  await expect(page.locator('main')).toContainText('0x742d')
  const walletRow = page.locator('div[class*="tableRow"]').filter({ hasText: /0x742d\.\.\.3f8a/i }).first()
  await walletRow.getByRole('button', { name: /^Block$/ }).click()
  await expect(walletRow.getByRole('button', { name: /^Blocked$/ })).toBeVisible()

  assertNoRuntimeErrors()
})
