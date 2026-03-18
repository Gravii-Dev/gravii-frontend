import { cn } from "@/lib/cn";
import { navItems, type NavItem } from "./landing-content";
import { dashboardHref, scrollToSection } from "./landing-constants";
import styles from "./landing-page.module.css";

function renderNavItem(item: NavItem) {
  if (item.sectionId) {
    const { sectionId } = item;

    return (
      <button
        className={cn(styles.buttonReset, styles.navLink)}
        key={item.label}
        onClick={() => scrollToSection(sectionId)}
        type="button"
      >
        {item.label}
      </button>
    );
  }

  if (!item.href) {
    return null;
  }

  return (
    <a
      className={styles.navLink}
      href={item.href}
      key={item.label}
      rel={item.external ? "noreferrer" : undefined}
      target={item.external ? "_blank" : undefined}
    >
      {item.label}
    </a>
  );
}

export function SiteNav({ isScrolled }: { isScrolled: boolean }) {
  return (
    <nav className={cn(styles.nav, isScrolled && styles.navScrolled)} id="mainNav">
      <button
        className={cn(styles.buttonReset, styles.navLogo)}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        type="button"
      >
        Gravii
      </button>

      <div className={styles.navLinks}>
        {navItems.map(renderNavItem)}
        <a className={styles.navGetStarted} href={dashboardHref}>
          Get Started
        </a>
        <button className={styles.navDemo} type="button">
          Book a Demo
        </button>
      </div>
    </nav>
  );
}
