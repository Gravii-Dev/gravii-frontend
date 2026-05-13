"use client";

import ActionButton from "@/components/ui/action-button";

import styles from "./x-ray-credit-purchase-modal.module.css";

type XRayCreditPurchaseModalProps = {
  creditBundleLabel: string;
  errorMessage?: string | null;
  isLoading?: boolean;
  onCancel: () => void;
  onContinue: () => void;
};

export default function XRayCreditPurchaseModal({
  creditBundleLabel,
  errorMessage,
  isLoading = false,
  onCancel,
  onContinue,
}: XRayCreditPurchaseModalProps) {
  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label="Buy X-Ray credits"
        onClick={(event) => event.stopPropagation()}
      >
        <p className={styles.kicker}>X-Ray checkout</p>
        <p className={styles.price}>{creditBundleLabel}</p>
        <p className={styles.copy}>
          Continue to Stripe Checkout to add analysis credits. Credits are granted only after backend webhook fulfillment confirms payment.
        </p>
        <p className={styles.hint}>The frontend creates a checkout session; the backend owns pricing, metadata, and credit delivery.</p>
        {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}
        <div className={styles.actions}>
          <ActionButton
            size="panel"
            className={`${styles.button} ${styles.secondary}`}
            onClick={onCancel}
            disabled={isLoading}
          >
            CANCEL
          </ActionButton>
          <ActionButton
            size="panel"
            className={`${styles.button} ${styles.primary}`}
            onClick={onContinue}
            disabled={isLoading}
          >
            {isLoading ? "OPENING..." : "CONTINUE TO CHECKOUT"}
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
