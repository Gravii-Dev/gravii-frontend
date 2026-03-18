'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'

import { personaMappings } from '@/features/labels/data'

import styles from './persona-modal.module.css'

interface PersonaModalProps {
  open: boolean
  onClose: () => void
}

export function PersonaModal({ open, onClose }: PersonaModalProps) {
  useEffect(() => {
    if (!open) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, open])

  if (!open) {
    return null
  }

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Persona mapping"
      >
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>
        <h2 className={styles.title}>Segment to user persona mapping</h2>
        <p className={styles.subtitle}>
          Campaigns show the user-facing persona on profile, not the analytics label.
        </p>
        <div className={styles.table}>
          {personaMappings.map((mapping, index) => (
            <div key={mapping.analyticsLabel} className={styles.row}>
              <span className={styles.number}>{index + 1}</span>
              <span className={styles.analyticsLabel}>{mapping.analyticsLabel}</span>
              <span className={styles.arrow}>→</span>
              <span className={styles.persona}>{mapping.userPersona}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
