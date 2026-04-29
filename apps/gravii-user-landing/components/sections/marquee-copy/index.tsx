import { MaskReveal } from '@/components/effects/mask-reveal'
import { ScrubTextReveal } from '@/components/effects/scrub-text-reveal'
import s from './marquee-copy.module.css'

const LABELS = [
  'Pro Trader',
  'DeFi Native',
  'NFT Collector',
  'Whale',
  'Builder',
  'Explorer',
  'HODLer',
  'Yield Farmer',
  'DAO Voter',
  'Airdrop Hunter',
  'Bridge Hopper',
  'Staker',
  'Liquidity Provider',
  'Minter',
  'Flipper',
  'Dormant Whale',
  'Gas Optimizer',
  'Multi-chain Native',
  'Early Adopter',
  'Degen',
] as const

export function MarqueeCopy() {
  const forward = LABELS.map((label) => ({
    id: `forward-${label}`,
    label,
  }))
  const reverse = [...LABELS].reverse().map((label) => ({
    id: `reverse-${label}`,
    label,
  }))

  return (
    <section
      id="marquee-copy"
      className={s.section}
    >
      <MaskReveal className={s.revealRow} start="top 62%">
        <div className={s.marqueeViewport}>
          <div className={`${s.track} ${s.trackForward}`}>
            {[0, 1].map((cycle) => (
              <div
                key={`forward-group-${cycle}`}
                aria-hidden={cycle === 1}
                className={s.group}
              >
                {forward.map((item) => (
                  <span key={`${item.id}-${cycle}`} className={s.pill}>
                    {item.label}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </MaskReveal>

      <div className={s.center}>
        <MaskReveal
          className={s.titleReveal}
          innerClassName={s.titleInner}
          delay={0.04}
          start="top 62%"
        >
          <ScrubTextReveal as="h2" className={s.title} text="Dressed in data. Find your fit." />
        </MaskReveal>
        <MaskReveal
          className={s.subtitleReveal}
          innerClassName={s.subtitleInner}
          delay={0.1}
          start="top 62%"
        >
          <p className={s.subtitle}>20 behavioral types</p>
        </MaskReveal>
      </div>

      <MaskReveal className={s.revealRow} delay={0.12} start="top 62%">
        <div className={s.marqueeViewport}>
          <div className={`${s.track} ${s.trackReverse}`}>
            {[0, 1].map((cycle) => (
              <div
                key={`reverse-group-${cycle}`}
                aria-hidden={cycle === 1}
                className={s.group}
              >
                {reverse.map((item) => (
                  <span key={`${item.id}-${cycle}`} className={s.pill}>
                    {item.label}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </MaskReveal>
    </section>
  )
}
