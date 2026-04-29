import {
  scopeOptions,
  type ScopeId
} from './data'
import styles from './campaign-builder.module.css'

function togglePillValue<T extends string>(current: T[], next: T): T[] {
  if (next === 'all') {
    return ['all' as T]
  }

  const withoutAll = current.filter((value) => value !== ('all' as T))
  const updated = withoutAll.includes(next)
    ? withoutAll.filter((value) => value !== next)
    : [...withoutAll, next]

  return updated.length > 0 ? updated : ['all' as T]
}

export function ScopePills({
  value,
  onChange,
  disabled = false
}: {
  value: ScopeId
  onChange: (next: ScopeId) => void
  disabled?: boolean
}) {
  return (
    <div className={styles.pillRow}>
      {scopeOptions.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`${styles.pillButton} ${value === option.id ? styles.pillButtonActive : ''} ${disabled ? styles.pillButtonDisabled : ''}`}
          onClick={() => onChange(option.id)}
          disabled={disabled}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export function MultiPills<T extends string>({
  value,
  options,
  onToggle
}: {
  value: T[]
  options: Array<{ id: T; label: string }>
  onToggle: (next: T) => void
}) {
  return (
    <div className={styles.pillRow}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`${styles.pillButton} ${value.includes(option.id) ? styles.pillButtonActive : ''}`}
          onClick={() => {
            const next = togglePillValue(value, option.id)

            for (const item of next) {
              if (!value.includes(item)) {
                onToggle(item)
              }
            }

            for (const item of value) {
              if (!next.includes(item)) {
                onToggle(item)
              }
            }
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export function SinglePills<T extends string>({
  value,
  options,
  onChange
}: {
  value: T
  options: Array<{ id: T; label: string }>
  onChange: (next: T) => void
}) {
  return (
    <div className={styles.pillRow}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`${styles.pillButton} ${value === option.id ? styles.pillButtonActive : ''}`}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
