"use client";

import styles from "./x-ray-pay-modal.module.css";

type XRayPayModalProps = {
  priceLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function XRayPayModal({ priceLabel, onCancel, onConfirm }: XRayPayModalProps) {
  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label="Confirm analysis payment"
        onClick={(event) => event.stopPropagation()}
      >
        <p className={styles.price}>{priceLabel}</p>
        <p className={styles.copy}>Confirm payment to analyze this wallet through the Gravii intelligence layer.</p>
        <p className={styles.hint}>* All transactions are final.</p>
        <div className={styles.actions}>
          <button type="button" className={`${styles.button} ${styles.secondary}`} onClick={onCancel}>
            CANCEL
          </button>
          <button type="button" className={`${styles.button} ${styles.primary}`} onClick={onConfirm}>
            CONFIRM & PAY
          </button>
        </div>
      </div>
    </div>
  );
}
