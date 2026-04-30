import { expect, test } from '@playwright/test'

const localHostPattern = /(localhost|127\.0\.0\.1)/

test('home launch app hands off to the user app', async ({ page }) => {
  await page.goto('http://localhost:3000/?utm_source=test&ref=alpha')

  const launchAppLink = page.getByRole('link', { name: 'LAUNCH APP' })

  await expect(launchAppLink).toHaveAttribute(
    'href',
    new RegExp(`http:\\/\\/${localHostPattern.source}:3003\\/\\?(.+&)?utm_source=test(&.+)?`)
  )
  await expect(launchAppLink).toHaveAttribute('target', '_self')

  await Promise.all([
    page.waitForURL(new RegExp(`http:\\/\\/${localHostPattern.source}:3003\\/sign-in\\?next=%2F`)),
    launchAppLink.click()
  ])

  await expect(
    page.getByRole('heading', { name: 'Sign in with your wallet.' })
  ).toBeVisible()
})

test('partners get started hands off to the partner app', async ({ page }) => {
  await page.goto('http://localhost:3000/partners?utm_source=test&ref=alpha')

  const getStartedLink = page.getByRole('link', { name: 'Get Started' }).first()

  await expect(getStartedLink).toHaveAttribute(
    'href',
    new RegExp(`http:\\/\\/${localHostPattern.source}:3001\\/?\\?(.+&)?utm_source=test(&.+)?`)
  )

  await Promise.all([
    page.waitForURL(new RegExp(`http:\\/\\/${localHostPattern.source}:3001\\/sign-in\\?next=%2F`)),
    getStartedLink.click()
  ])

  await expect(
    page.getByRole('heading', {
      name: 'Sign in with Google to access your partner area.'
    })
  ).toBeVisible()
})
