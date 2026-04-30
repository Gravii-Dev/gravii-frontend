import { MaskReveal } from '@/components/effects/mask-reveal'
import { WaitlistForm } from './form'
import s from './waitlist.module.css'

export function Waitlist() {
  return (
    <section
      id="waitlist"
      className={s.section}
    >
      <div className={s.inner}>
        <div className={s.titleReveal}>
          <h2 className={s.title}>
            We search.
            <br />
            Your lifestyle.
            <br />
            Live different.
          </h2>
        </div>

        <MaskReveal className={s.formReveal} delay={0.08} completeAtPageEnd>
          <WaitlistForm />
        </MaskReveal>
      </div>
    </section>
  )
}
