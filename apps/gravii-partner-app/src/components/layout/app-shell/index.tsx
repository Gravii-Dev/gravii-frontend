'use client'

import {
  Menu,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { KeyboardEvent, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

import { usePartnerAuth } from '@/features/auth/auth-provider'
import { cn } from '@/lib/cn'
import {
  formatPartnerPlanLabel,
  getPartnerWorkspaceName
} from '@/lib/partner-profile'
import { useWorkspaceAccess } from '@/lib/workspace-access'
import {
  appShellNavItems,
  campaignHint,
  getPageId,
  insightsHint,
} from '@/lib/workspace-navigation'
import styles from './app-shell.module.css'

const shouldPrefetchRoutes = process.env.NODE_ENV === 'production'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const auth = usePartnerAuth()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [botInput, setBotInput] = useState('')
  const [botLocked, setBotLocked] = useState(false)
  const timersRef = useRef<number[]>([])
  const workspaceAccess = useWorkspaceAccess()

  useEffect(
    () => () => {
      for (const timer of timersRef.current) {
        window.clearTimeout(timer)
      }
    },
    []
  )

  const activeModuleId = searchParams.get('module')
  const activePageId = getPageId(pathname, activeModuleId)
  const workspaceName = getPartnerWorkspaceName(auth.session)
  const workspacePlan = formatPartnerPlanLabel(auth.session?.plan)
  const isCampaignMode = activePageId === 'campaigns' || activePageId === 'campmanager'
  const botPlaceholder = isCampaignMode
    ? 'Describe your campaign in plain English'
    : "Ask about your users' data"
  const botHint = isCampaignMode ? campaignHint : insightsHint

  useEffect(() => {
    if (
      pathname === '/' ||
      pathname === '/sign-in' ||
      !activePageId ||
      workspaceAccess.visiblePages.has(activePageId)
    ) {
      return
    }

    router.replace(workspaceAccess.defaultHref)
  }, [activePageId, pathname, router, workspaceAccess.defaultHref, workspaceAccess.visiblePages])

  const visibleNavItems = appShellNavItems.filter((item) =>
    workspaceAccess.visiblePages.has(item.pageId)
  )
  const connectVisible = (['drive', 'api', 'bot', 'agent'] as const).some((pageId) =>
    workspaceAccess.visiblePages.has(pageId)
  )
  const dashboardVisible = (['overview', 'analytics', 'labels', 'risk'] as const).some((pageId) =>
    workspaceAccess.visiblePages.has(pageId)
  )
  const lensVisible = workspaceAccess.visiblePages.has('analyze')
  const campaignsVisible = workspaceAccess.visiblePages.has('campaigns')
  const campaignManagerVisible = workspaceAccess.visiblePages.has('campmanager')
  const reachVisible = campaignsVisible || campaignManagerVisible

  useEffect(() => {
    if (!shouldPrefetchRoutes || auth.status !== 'authenticated') {
      return
    }

    const hrefs = new Set<string>([
      workspaceAccess.defaultHref,
      ...visibleNavItems.map((item) => item.href)
    ])

    for (const href of hrefs) {
      router.prefetch(href)
    }
  }, [auth.status, router, visibleNavItems, workspaceAccess.defaultHref])

  if (pathname === '/sign-in') {
    return <>{children}</>
  }

  if (auth.status !== 'authenticated') {
    return (
      <div className={styles.authGate}>
        <div className={styles.authGateTitle}>Restoring your partner workspace…</div>
        <div className={styles.authGateCopy}>
          Gravii is validating your Google session and loading the workspace shell.
        </div>
      </div>
    )
  }

  if (!workspaceAccess.canAccessWorkspace || workspaceAccess.isSuspended) {
    return (
      <div className={styles.authGate}>
        <div className={styles.authGateTitle}>Your Gravii partner workspace is paused.</div>
        <div className={styles.authGateCopy}>
          Sign in succeeded, but this partner profile is not marked as active yet. Please contact the Gravii team to restore access.
        </div>
      </div>
    )
  }

  if (pathname === '/') {
    return <>{children}</>
  }

  const handleBotSubmit = () => {
    const nextPrompt = botInput.trim()

    if (!nextPrompt || botLocked) {
      return
    }

    if (isCampaignMode) {
      router.push(`/reach?prompt=${encodeURIComponent(nextPrompt)}`)
      setBotInput('')
      return
    }

    setBotLocked(true)
    setBotInput('Analyzing your data...')

    const loadingTimer = window.setTimeout(() => {
      setBotInput(
        'Insights will be available in the live product. Try Campaign Builder to see the AI demo.'
      )

      const resetTimer = window.setTimeout(() => {
        setBotLocked(false)
        setBotInput('')
      }, 3000)

      timersRef.current.push(resetTimer)
    }, 1500)

    timersRef.current.push(loadingTimer)
  }

  const handleBotKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleBotSubmit()
    }
  }

  return (
    <div className={styles.shell}>
      <aside className={cn(styles.sidebar, isMobileOpen && styles.sidebarOpen)}>
        <div className={styles.sidebarTop}>
          <div className={styles.logo}>
            <span className={styles.logoGlow}>Gravii</span>
            <div className={styles.logoMeta}>
              <span className={styles.workspaceName}>{workspaceName}</span>
              <span className={styles.workspacePlan}>{workspacePlan}</span>
            </div>
          </div>

          <nav className={styles.nav}>
            {lensVisible ? <span className={styles.sectionLabel}>LENS</span> : null}
            {visibleNavItems
              .filter((item) => item.section === 'LENS')
              .map((item) => (
                <NavLink
                  key={item.pageId}
                  href={item.href}
                  isActive={activePageId === item.pageId}
                >
                  {item.label}
                </NavLink>
              ))}

            {lensVisible && (connectVisible || dashboardVisible || reachVisible || workspaceAccess.visiblePages.has('settings')) ? (
              <div className={styles.navDivider} />
            ) : null}

            {connectVisible ? <span className={styles.sectionLabel}>CONNECT</span> : null}
            {visibleNavItems
              .filter((item) => item.section === 'CONNECT')
              .map((item) => (
                <NavLink
                  key={item.pageId}
                  href={item.href}
                  isActive={activePageId === item.pageId}
                >
                  {item.label}
                </NavLink>
              ))}

            {connectVisible && (dashboardVisible || reachVisible || workspaceAccess.visiblePages.has('settings')) ? (
              <div className={styles.navDivider} />
            ) : null}

            {dashboardVisible ? <span className={styles.sectionLabel}>DASHBOARD</span> : null}
            {visibleNavItems
              .filter((item) => item.section === 'DASHBOARD')
              .map((item) => (
                <NavLink
                  key={item.pageId}
                  href={item.href}
                  isActive={activePageId === item.pageId}
                >
                  {item.label}
                </NavLink>
              ))}

            {dashboardVisible && (reachVisible || workspaceAccess.visiblePages.has('settings')) ? (
              <div className={styles.navDivider} />
            ) : null}

            {reachVisible ? (
              <div className={styles.reachBlock}>
                {campaignsVisible ? (
                  <Link
                    href="/reach"
                    className={cn(styles.navCta, activePageId === 'campaigns' && styles.navCtaActive)}
                  >
                    Create Campaign
                  </Link>
                ) : null}
                {campaignManagerVisible ? (
                  <Link
                    href="/campaign-manager"
                    className={cn(
                      styles.managerButton,
                      activePageId === 'campmanager' && styles.managerButtonActive
                    )}
                  >
                    Manager
                  </Link>
                ) : null}
              </div>
            ) : null}

            {reachVisible && workspaceAccess.visiblePages.has('settings') ? <div className={styles.navDivider} /> : null}

            {workspaceAccess.visiblePages.has('settings') ? (
              <NavLink href="/settings" isActive={activePageId === 'settings'}>
                Settings
              </NavLink>
            ) : null}
          </nav>

          <div className={styles.bot}>
            <div className={styles.botHeader}>
              <div className={styles.botLabel}>{isCampaignMode ? 'Launch Assistant' : 'Gravii Insights'}</div>
              <span className={cn(styles.botMode, isCampaignMode ? styles.botModeCampaign : styles.botModeInsights)}>
                {isCampaignMode ? 'Campaign Builder' : 'Data Insights'}
              </span>
            </div>
            <div className={cn(styles.botBox, isCampaignMode && styles.botBoxCampaign)}>
              <div className={styles.botInputWrap}>
                <textarea
                  id="botInput"
                  className={styles.botInput}
                  value={botInput}
                  onChange={(event) => setBotInput(event.target.value)}
                  onKeyDown={handleBotKeyDown}
                  placeholder={botPlaceholder}
                  disabled={botLocked}
                />
                <button type="button" className={styles.botSend} onClick={handleBotSubmit}>
                  -&gt;
                </button>
              </div>
              <div className={styles.botHint}>{botHint}</div>
            </div>
          </div>
        </div>

        <div className={styles.sidebarBottom}>
          <Link href="/" className={styles.backLink}>
            <span>&larr;</span>
            <span>Back to Setup</span>
          </Link>
        </div>
      </aside>

      <div className={styles.content}>
        <header className={styles.mobileHeader}>
          <button
            type="button"
            className={styles.mobileButton}
            onClick={() => setIsMobileOpen((current) => !current)}
            aria-label={isMobileOpen ? 'Close navigation' : 'Open navigation'}
          >
            {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div>
            <p className={styles.mobileTitle}>Gravii</p>
            <p className={styles.mobileSubtitle}>Partner intelligence</p>
          </div>
        </header>

        <main className={styles.main}>{children}</main>
      </div>

      {isMobileOpen ? (
        <button
          type="button"
          className={styles.overlay}
          onClick={() => setIsMobileOpen(false)}
          aria-label="Close navigation"
        />
      ) : null}
    </div>
  )
}

interface NavLinkProps {
  href: string
  isActive: boolean
  children: ReactNode
}

function NavLink({ href, isActive, children }: NavLinkProps) {
  return (
    <Link href={href} className={cn(styles.navItem, isActive && styles.navItemActive)}>
      <span>{children}</span>
    </Link>
  )
}
