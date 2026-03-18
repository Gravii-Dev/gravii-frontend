'use client'

import {
  Bot,
  ChartColumnBig,
  FolderKanban,
  LayoutDashboard,
  Link2,
  Menu,
  Settings,
  ShieldAlert,
  Upload,
  UsersRound,
  Waypoints,
  X,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { KeyboardEvent, ReactNode } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { cn } from '@/lib/cn'
import {
  appShellNavItems,
  campaignHint,
  getDefaultWorkspaceHref,
  getPageId,
  getVisiblePageIds,
  insightsHint,
} from '@/lib/workspace-navigation'
import { useWorkspaceSettings } from '@/lib/workspace-settings'
import styles from './app-shell.module.css'

interface AppShellProps {
  children: ReactNode
}

const navIconMap = {
  analyze: Upload,
  drive: UsersRound,
  api: Link2,
  bot: Bot,
  agent: Zap,
  overview: LayoutDashboard,
  analytics: ChartColumnBig,
  labels: Waypoints,
  risk: ShieldAlert,
  settings: Settings,
  campaigns: Zap,
  campmanager: FolderKanban
} as const

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [botInput, setBotInput] = useState('')
  const [botLocked, setBotLocked] = useState(false)
  const timersRef = useRef<number[]>([])
  const workspaceSettings = useWorkspaceSettings()

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
  const isCampaignMode = activePageId === 'campaigns' || activePageId === 'campmanager'
  const botPlaceholder = isCampaignMode
    ? 'Describe your campaign in plain English'
    : "Ask about your users' data"
  const botHint = isCampaignMode ? campaignHint : insightsHint

  const visiblePages = useMemo(
    () => getVisiblePageIds(workspaceSettings.enabledPages),
    [workspaceSettings.enabledPages]
  )

  useEffect(() => {
    if (pathname === '/' || !activePageId || visiblePages.has(activePageId)) {
      return
    }

    router.replace(getDefaultWorkspaceHref(workspaceSettings.enabledPages))
  }, [activePageId, pathname, router, visiblePages, workspaceSettings.enabledPages])

  const visibleNavItems = appShellNavItems.filter((item) => visiblePages.has(item.pageId))
  const connectVisible = (['drive', 'api', 'bot', 'agent'] as const).some((pageId) =>
    visiblePages.has(pageId)
  )
  const dashboardVisible = (['overview', 'analytics', 'labels', 'risk'] as const).some((pageId) =>
    visiblePages.has(pageId)
  )
  const lensVisible = visiblePages.has('analyze')
  const campaignsVisible = visiblePages.has('campaigns')
  const campaignManagerVisible = visiblePages.has('campmanager')
  const reachVisible = campaignsVisible || campaignManagerVisible

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
          </div>

          <nav className={styles.nav}>
            {lensVisible ? <span className={styles.sectionLabel}>LENS</span> : null}
            {visibleNavItems
              .filter((item) => item.section === 'LENS')
              .map((item) => (
                <NavLink
                  key={item.pageId}
                  href={item.href}
                  pageId={item.pageId}
                  isActive={activePageId === item.pageId}
                >
                  {item.label}
                </NavLink>
              ))}

            {lensVisible && (connectVisible || dashboardVisible || reachVisible || visiblePages.has('settings')) ? (
              <div className={styles.navDivider} />
            ) : null}

            {connectVisible ? <span className={styles.sectionLabel}>CONNECT</span> : null}
            {visibleNavItems
              .filter((item) => item.section === 'CONNECT')
              .map((item) => (
                <NavLink
                  key={item.pageId}
                  href={item.href}
                  pageId={item.pageId}
                  isActive={activePageId === item.pageId}
                >
                  {item.label}
                </NavLink>
              ))}

            {connectVisible && (dashboardVisible || reachVisible || visiblePages.has('settings')) ? (
              <div className={styles.navDivider} />
            ) : null}

            {dashboardVisible ? <span className={styles.sectionLabel}>DASHBOARD</span> : null}
            {visibleNavItems
              .filter((item) => item.section === 'DASHBOARD')
              .map((item) => (
                <NavLink
                  key={item.pageId}
                  href={item.href}
                  pageId={item.pageId}
                  isActive={activePageId === item.pageId}
                >
                  {item.label}
                </NavLink>
              ))}

            {dashboardVisible && (reachVisible || visiblePages.has('settings')) ? (
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

            {reachVisible && visiblePages.has('settings') ? <div className={styles.navDivider} /> : null}

            {visiblePages.has('settings') ? (
              <NavLink href="/settings" pageId="settings" isActive={activePageId === 'settings'}>
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
  pageId: keyof typeof navIconMap
  isActive: boolean
  children: ReactNode
}

function NavLink({ href, pageId, isActive, children }: NavLinkProps) {
  const Icon = navIconMap[pageId]

  return (
    <Link href={href} className={cn(styles.navItem, isActive && styles.navItemActive)}>
      <span className={styles.navIcon}>
        <Icon size={16} strokeWidth={1.9} />
      </span>
      <span>{children}</span>
    </Link>
  )
}
