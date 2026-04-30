'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/cn'

import { AuthHandoffLink } from './auth-handoff-link'
import { navItems, type NavItem } from './landing-content'
import { dashboardHref, scrollToSection } from './landing-constants'
import styles from './landing-page.module.css'

function renderNavItem(item: NavItem, onComplete?: () => void) {
  if (item.sectionId) {
    const { sectionId } = item

    return (
      <button
        className={cn(styles.buttonReset, styles.navLink)}
        key={item.label}
        onClick={() => {
          scrollToSection(sectionId)
          onComplete?.()
        }}
        type="button"
      >
        {item.label}
      </button>
    )
  }

  if (!item.href) {
    return null
  }

  return (
    <a
      className={styles.navLink}
      href={item.href}
      key={item.label}
      rel={item.external ? 'noreferrer' : undefined}
      target={item.external ? '_blank' : undefined}
      onClick={() => onComplete?.()}
    >
      {item.label}
    </a>
  )
}

function renderMobileNavItem(item: NavItem, onComplete?: () => void) {
  if (item.sectionId) {
    const { sectionId } = item

    return (
      <button
        className={cn(styles.buttonReset, styles.mobileLink)}
        key={item.label}
        onClick={() => {
          scrollToSection(sectionId)
          onComplete?.()
        }}
        type="button"
      >
        {item.label}
      </button>
    )
  }

  if (!item.href) {
    return null
  }

  return (
    <a
      className={styles.mobileLink}
      href={item.href}
      key={item.label}
      rel={item.external ? 'noreferrer' : undefined}
      target={item.external ? '_blank' : undefined}
      onClick={() => onComplete?.()}
    >
      {item.label}
    </a>
  )
}

export function SiteNav({ isScrolled }: { isScrolled: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <>
      <nav className={cn(styles.nav, isScrolled && styles.navScrolled)} id="mainNav">
        <button
          className={cn(styles.buttonReset, styles.navLogo)}
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setMobileMenuOpen(false)
          }}
          type="button"
        >
          Gravii
        </button>

        <div className={styles.navLinks}>
          {navItems.map((item) => renderNavItem(item))}
          <AuthHandoffLink className={styles.navGetStarted} href={dashboardHref}>
            Get Started
          </AuthHandoffLink>
          <a className={styles.navDemo} href="mailto:partners@gravii.io">
            Book a Demo
          </a>
        </div>

        <button
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className={cn(styles.hamburger, mobileMenuOpen && styles.hamburgerOpen)}
          onClick={() => setMobileMenuOpen((current) => !current)}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div
        className={cn(styles.mobileOverlay, mobileMenuOpen && styles.mobileOverlayOpen)}
        onClick={() => setMobileMenuOpen(false)}
      >
        {navItems.map((item) => renderMobileNavItem(item, () => setMobileMenuOpen(false)))}
        <AuthHandoffLink
          className={cn(styles.mobileLink, styles.mobileLinkGetStarted)}
          href={dashboardHref}
          onClick={() => setMobileMenuOpen(false)}
        >
          Get Started
        </AuthHandoffLink>
        <a
          className={cn(styles.mobileLink, styles.mobileLinkDemo)}
          href="mailto:partners@gravii.io"
          onClick={() => setMobileMenuOpen(false)}
        >
          Book a Demo
        </a>
      </div>
    </>
  )
}
