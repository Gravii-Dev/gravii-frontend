import { expect, test } from '@playwright/test'

test('user app redirects anonymous traffic to the live wallet sign-in surface', async ({
  page
}) => {
  await page.goto('http://localhost:3003/')

  await expect(page).toHaveURL(/\/sign-in\?next=%2F$/)
  await expect(
    page.getByRole('heading', { name: 'Sign in with your wallet.' })
  ).toBeVisible()
  await expect(
    page.getByRole('button', {
      name: /Connect your wallet to enter Gravii|Checking your Gravii session/i
    })
  ).toBeVisible()
})

test('partner app redirects anonymous traffic to the live Google sign-in surface', async ({
  page
}) => {
  await page.goto('http://localhost:3001/dashboard')

  await expect(page).toHaveURL(/\/sign-in\?next=%2Fdashboard$/)
  await expect(
    page.getByRole('heading', {
      name: 'Sign in with Google to access your partner area.'
    })
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: /Continue with Google|Checking session/i })
  ).toBeVisible()
  await expect(page.getByText('/dashboard')).toBeVisible()
})

test('admin app redirects anonymous traffic to the workspace sign-in surface', async ({
  page
}) => {
  await page.goto('http://localhost:3004/')

  await expect(page).toHaveURL(/\/sign-in\?next=%2F$/)
  await expect(
    page.getByRole('heading', { name: 'Sign in with your workspace account.' })
  ).toBeVisible()
  await expect(
    page.getByRole('button', {
      name: /Continue with Google Workspace|Checking session/i
    })
  ).toBeVisible()
  await expect(page.getByRole('textbox', { name: 'Workspace email' })).toHaveValue(
    'admin@gravii.io'
  )
})

test('partner sign-in page preserves explicit next paths', async ({ page }) => {
  await page.goto('http://localhost:3001/sign-in?next=%2Freach')

  await expect(page.getByText('/reach')).toBeVisible()
})
