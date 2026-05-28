import { Link } from '@/components/ui/link'
import { CtaPill } from '@/components/sections/vision/cta-pill'
import s from './waitlist.module.css'

export function Waitlist() {
  return (
    <footer id="waitlist" className={s.section}>
      <div className={s.inner}>
        <div className={s.left}>
          <span className={s.brand}>GRAVII</span>
          <span className={s.signature}>A Reputation Passport.</span>
        </div>
        <div className={s.middle}>
          <CtaPill />
        </div>
        <div className={s.right}>
          <div className={s.row}>
            <Link className={s.link} href="https://x.com/gravii_io">
              X
            </Link>
            <span aria-hidden="true" className={s.dot}>
              ·
            </span>
            <Link className={s.link} href="https://discord.gg/gravii">
              Discord
            </Link>
          </div>
          <div className={s.row}>
            <span className={s.muted}>© 2026 Gravii</span>
          </div>
          <div className={s.row}>
            <Link className={s.link} href="/privacy">
              Privacy
            </Link>
            <span aria-hidden="true" className={s.dot}>
              ·
            </span>
            <Link className={s.link} href="/terms">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
