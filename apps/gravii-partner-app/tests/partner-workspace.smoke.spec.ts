import { test, expect, type Page } from '@playwright/test'

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

async function openHome(page: Page) {
  await page.goto(baseURL)
  await page.waitForLoadState('networkidle')
}

test.describe.configure({ mode: 'serial' })

test.use({
  permissions: ['clipboard-read', 'clipboard-write']
})

test('scenario entry points and onboarding animations work', async ({ page }) => {
  const assertNoRuntimeErrors = attachRuntimeWatch(page)

  await openHome(page)

  const firstCard = page.getByRole('button', { name: /Your ecosystem only/i })
  await expect(firstCard).toBeVisible()

  const transitionDuration = await firstCard.evaluate((element) =>
    window.getComputedStyle(element).transitionDuration
  )
  expect(transitionDuration).not.toBe('0s')

  const cases = [
    {
      label: 'Your ecosystem only',
      url: /\/connect\?module=xray-link$/,
      content: 'X-Ray Link'
    },
    {
      label: 'Expand with Gravii pool',
      url: /\/connect\?module=xray-link$/,
      content: 'Recommended for your selected scenario'
    },
    {
      label: 'Discover new users',
      url: /\/reach$/,
      content: 'Locked to discover new users.'
    },
    {
      label: 'See your user pool',
      url: /\/lens$/,
      content: 'Analyze your wallet pool'
    },
    {
      label: 'Web API',
      url: /\/connect\?module=gate-api$/,
      content: 'Gate API'
    },
    {
      label: 'Community Bot',
      url: /\/connect\?module=community-bot$/,
      content: 'Community Bot'
    },
    {
      label: 'Agent API',
      url: /\/connect\?module=agent-api$/,
      content: 'Agent API'
    }
  ]

  for (const item of cases) {
    await openHome(page)
    await page.getByRole('button', { name: new RegExp(item.label, 'i') }).click()
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(item.url, { timeout: 15000 })
    await expect(page.locator('main')).toContainText(item.content)
  }

  await openHome(page)
  await page.getByRole('button', { name: /See your user pool/i }).click()
  await page.getByRole('button', { name: /Upload sample CSV/i }).click()
  await expect(page.getByText(/Analysis report/i)).toBeVisible()
  await page.getByRole('link', { name: /Open X-Ray Users/i }).click()
  await page.waitForLoadState('networkidle')
  await expect(page).toHaveURL(/\/connect\?module=xray-link$/, { timeout: 15000 })

  assertNoRuntimeErrors()
})

test('workspace pages and core interactions work without runtime errors', async ({ page }) => {
  const assertNoRuntimeErrors = attachRuntimeWatch(page)

  await openHome(page)
  await page.getByRole('button', { name: /Expand with Gravii pool/i }).click()
  await page.waitForLoadState('networkidle')

  await page.getByRole('button', { name: /Copy invite link/i }).click()
  await expect(page.getByRole('button', { name: /Copied link/i })).toBeVisible()
  await page.getByRole('button', { name: /Preview referral flow/i }).click()
  await expect(page.getByText(/Referral preview/i)).toBeVisible()

  await page.getByRole('link', { name: /Overview/i }).click()
  await page.waitForLoadState('networkidle')
  await expect(page.locator('main')).toContainText('Partner Intelligence')
  await page.getByRole('link', { name: /Go to User Analytics/i }).click()
  await page.waitForLoadState('networkidle')

  await expect(page).toHaveURL(/\/analytics$/, { timeout: 15000 })
  await page.getByRole('button', { name: /By Region/i }).click()
  await page.getByRole('button', { name: /^US$/ }).click()
  await expect(page.getByText(/Black · .*users · Avg Portfolio/i)).toBeVisible()
  await page.getByRole('button', { name: /^Gold$/ }).click()
  await expect(page.getByText(/Gold · .*users · Avg Portfolio/i)).toBeVisible()

  await page.getByRole('link', { name: /User Segments/i }).click()
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: /Persona mapping/i }).click()
  await expect(page.getByRole('dialog', { name: /Persona mapping/i })).toBeVisible()
  await expect(page.getByText(/Campaigns show the user-facing persona/i)).toBeVisible()
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: /By Value/i }).click()
  await page.locator('main').getByRole('button', { name: /^gold$/i }).click()
  await expect(page.getByText(/1 filters/i)).toBeVisible()

  await page.getByRole('link', { name: /Risk & Sybil/i }).click()
  await page.waitForLoadState('networkidle')
  await page.locator('select').first().selectOption('critical')
  await page.getByRole('button', { name: /^Block$/ }).first().click()
  await expect(page.getByRole('button', { name: /^Blocked$/ }).first()).toBeVisible()

  await page.getByRole('link', { name: /Create Campaign/i }).click()
  await page.waitForLoadState('networkidle')
  await expect(page.getByText(/Locked to both/i)).toBeVisible()
  await expect(page.getByRole('button', { name: /Both/i })).toBeDisabled()
  const assistantInput = page.locator('#botInput')
  await assistantInput.fill('Yield boost for Black tier stakers on Ethereum')
  await assistantInput.press('Enter')
  await page.waitForLoadState('networkidle')
  await expect(
    page.locator('label').filter({ hasText: /^Campaign name$/ }).locator('input')
  ).toHaveValue('Yield Booster')
  await page.getByRole('button', { name: /By value/i }).click()
  await expect(page.locator('main')).toContainText('Black+')
  await page.locator('label').filter({ hasText: /Access type/i }).locator('select').selectOption('closed')
  await expect(page.locator('main')).toContainText('Closed')
  await expect(page.locator('main')).toContainText('CLOSED')
  await page.getByRole('button', { name: /Save as draft/i }).click()
  await expect(page.getByText(/Draft saved locally/i)).toBeVisible()

  await page.getByRole('link', { name: /Manager/i }).click()
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: /View Report/i }).first().click()
  await expect(page.getByRole('button', { name: /Close Report/i }).first()).toBeVisible()
  await page.getByRole('button', { name: /Ended/i }).click()
  await expect(page.getByText(/Early Access V4/i)).toBeVisible()
  await page.getByRole('button', { name: /All/i }).click()
  await page.getByRole('link', { name: /Edit Campaign/i }).first().click()
  await page.waitForLoadState('networkidle')
  await expect(page).toHaveURL(/\/reach\?campaign=yield-booster$/, { timeout: 15000 })
  await expect(page.getByText(/preset loaded/i)).toBeVisible()

  await page.getByRole('link', { name: /Settings/i }).click()
  await page.waitForLoadState('networkidle')
  const analyticsSurfaceToggle = page
    .getByText('DASHBOARD surface · /analytics')
    .locator('xpath=../following-sibling::button')
  await analyticsSurfaceToggle.click()
  await expect(page.getByRole('link', { name: /User Analytics/i })).toHaveCount(0)
  await page.goto(`${baseURL}/analytics`)
  await page.waitForLoadState('networkidle')
  await expect(page).not.toHaveURL(/\/analytics$/, { timeout: 15000 })
  await page.getByRole('link', { name: /Settings/i }).click()
  await page.waitForLoadState('networkidle')
  await analyticsSurfaceToggle.click()
  await expect(page.getByRole('link', { name: /User Analytics/i })).toBeVisible()

  assertNoRuntimeErrors()
})
