import {
  scopeOptions,
  type ScopeId
} from './data'
import styles from './campaign-builder.module.css'

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
          onClick={() => onToggle(option.id)}
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
