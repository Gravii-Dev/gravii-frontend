"use client";

import ActionButton from "@/components/ui/action-button";

import styles from "./x-ray-credit-purchase-modal.module.css";

type XRayCreditPurchaseModalProps = {
  creditBundleLabel: string;
  onCancel: () => void;
  onContinue: () => void;
};

export default function XRayCreditPurchaseModal({
  creditBundleLabel,
  onCancel,
  onContinue,
}: XRayCreditPurchaseModalProps) {
  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label="Prepare X-Ray credit purchase"
        onClick={(event) => event.stopPropagation()}
      >
        <p className={styles.kicker}>Credit purchase layer</p>
        <p className={styles.price}>{creditBundleLabel}</p>
        <p className={styles.copy}>
          This reserved checkout step will let users add X-Ray credits once pricing, fulfillment, and webhook contracts are live.
        </p>
        <p className={styles.hint}>No transaction is started from the current frontend.</p>
        <div className={styles.actions}>
          <ActionButton size="panel" className={`${styles.button} ${styles.secondary}`} onClick={onCancel}>
            CANCEL
          </ActionButton>
          <ActionButton size="panel" className={`${styles.button} ${styles.primary}`} onClick={onContinue}>
            PREVIEW CHECKOUT
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
