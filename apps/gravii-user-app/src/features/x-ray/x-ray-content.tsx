"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getAddress } from "viem";

import ActionButton from "@/components/ui/action-button";
import GraviiLogo from "@/components/ui/gravii-logo";
import type { SharedContentProps } from "@/features/launch-app/types";
import XRayCreditPurchaseModal from "@/features/x-ray/components/x-ray-credit-purchase-modal";
import XRayHistoryList from "@/features/x-ray/components/x-ray-history-list";
import XRayResultView from "@/features/x-ray/components/x-ray-result-view";
import {
  formatLookupDate,
  formatWalletLabel,
  mapXrayDetailToViewModel,
  paginateLookupEntries,
  XRAY_SEARCH_STATS,
} from "@/features/x-ray/x-ray-view-model";
import {
  createUserXrayCheckoutSession,
  popPendingXrayWallet,
  readUserCredits,
  readUserLookupList,
  readUserXrayDetail,
  runUserXrayLookup,
  UserApiError,
} from "@/lib/auth/user-api";

import styles from "./x-ray-content.module.css";

const XRAY_CREDIT_BUNDLE = {
  id: "xray_credits_10",
  label: "10 X-Ray credits",
} as const;

function joinClasses(...classNames: Array<string | false | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

function buildXrayCheckoutReturnUrls() {
  const url = new URL(window.location.href);
  url.searchParams.set("panel", "lookup");

  const successUrl = new URL(url);
  successUrl.searchParams.set("xray_checkout", "success");

  const cancelUrl = new URL(url);
  cancelUrl.searchParams.set("xray_checkout", "cancelled");

  return {
    cancelUrl: cancelUrl.toString(),
    successUrl: successUrl.toString(),
  };
}

function readCheckoutNotice() {
  if (typeof window === "undefined") {
    return null;
  }

  const checkoutState = new URLSearchParams(window.location.search).get("xray_checkout");

  if (checkoutState === "success") {
    return "Checkout returned. Credits will appear after payment fulfillment is confirmed.";
  }

  if (checkoutState === "cancelled") {
    return "Checkout was cancelled. No X-Ray credits were added.";
  }

  return null;
}

export default function XRayContent({ dark, connected, onConnect }: SharedContentProps) {
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutNotice, setCheckoutNotice] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [historyPage, setHistoryPage] = useState(0);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isCheckoutStarting, setIsCheckoutStarting] = useState(false);
  const [isPanelLoading, setIsPanelLoading] = useState(false);
  const [isResultLoading, setIsResultLoading] = useState(false);
  const [lookupHistory, setLookupHistory] = useState<
    Awaited<ReturnType<typeof readUserLookupList>>["lookups"]
  >([]);
  const [result, setResult] = useState<ReturnType<typeof mapXrayDetailToViewModel> | null>(
    null
  );
  const [walletInput, setWalletInput] = useState("");
  const walletInputRef = useRef<HTMLInputElement | null>(null);

  const history = useMemo(
    () => paginateLookupEntries(lookupHistory, historyPage),
    [historyPage, lookupHistory]
  );

  useEffect(() => {
    setCheckoutNotice(readCheckoutNotice());
  }, []);

  const openWalletDetail = useCallback(
    async (walletAddress: string, showLoading = true) => {
      if (showLoading) {
        setIsResultLoading(true);
      }

      setErrorMessage(null);

      try {
        const detail = await readUserXrayDetail(walletAddress);
        setResult(mapXrayDetailToViewModel(detail));
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to open this X-Ray detail."
        );
      } finally {
        if (showLoading) {
          setIsResultLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    let cancelled = false;

    if (!connected) {
      setCredits(null);
      setLookupHistory([]);
      setResult(null);
      setErrorMessage(null);
      setWalletInput("");

      return () => {
        cancelled = true;
      };
    }

    const bootstrap = async () => {
      setIsPanelLoading(true);
      setErrorMessage(null);

      try {
        const [nextCredits, nextHistory] = await Promise.all([
          readUserCredits(),
          readUserLookupList(),
        ]);

        if (cancelled) {
          return;
        }

        setCredits(nextCredits);
        setLookupHistory(nextHistory.lookups);
        setHistoryPage(0);

        const pendingWallet = popPendingXrayWallet();
        if (pendingWallet) {
          setWalletInput(pendingWallet);
          await openWalletDetail(pendingWallet, false);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(error instanceof Error ? error.message : "Unable to load X-Ray.");
        }
      } finally {
        if (!cancelled) {
          setIsPanelLoading(false);
        }
      }
    };

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [connected, openWalletDetail]);

  const handleAnalyze = async () => {
    if (isPanelLoading) {
      return;
    }

    if (!connected) {
      onConnect();
      return;
    }

    if (!walletInput.trim()) {
      setErrorMessage("Enter a wallet address first.");
      walletInputRef.current?.focus();
      return;
    }

    let normalizedAddress = "";

    try {
      normalizedAddress = getAddress(walletInput.trim());
    } catch {
      setErrorMessage("Enter a valid EVM wallet address.");
      return;
    }

    setIsResultLoading(true);
    setErrorMessage(null);

    try {
      const lookup = await runUserXrayLookup(normalizedAddress);
      const [nextHistory, detail] = await Promise.all([
        readUserLookupList(),
        readUserXrayDetail(lookup.address),
      ]);

      setCredits(lookup.creditsRemaining);
      setLookupHistory(nextHistory.lookups);
      setHistoryPage(0);
      setResult(mapXrayDetailToViewModel(detail));
    } catch (error) {
      if (error instanceof UserApiError && error.status === 402) {
        setErrorMessage("Add X-Ray credits to continue this analysis.");
        setCheckoutError(null);
        setIsCheckoutModalOpen(true);
        return;
      }

      setErrorMessage(
        error instanceof Error ? error.message : "Analysis failed. Please try again."
      );
    } finally {
      setIsResultLoading(false);
    }
  };

  const handleOpenCheckout = () => {
    if (!connected) {
      onConnect();
      return;
    }

    setCheckoutError(null);
    setIsCheckoutModalOpen(true);
  };

  const handleStartCheckout = async () => {
    if (isCheckoutStarting) {
      return;
    }

    setIsCheckoutStarting(true);
    setCheckoutError(null);

    try {
      const returnUrls = buildXrayCheckoutReturnUrls();
      const session = await createUserXrayCheckoutSession({
        bundleId: XRAY_CREDIT_BUNDLE.id,
        cancelUrl: returnUrls.cancelUrl,
        successUrl: returnUrls.successUrl,
      });

      window.location.assign(session.checkoutUrl);
    } catch (error) {
      if (error instanceof UserApiError && error.status === 404) {
        setCheckoutError(
          "X-Ray checkout is not available for this account or credit bundle yet."
        );
      } else {
        setCheckoutError(
          error instanceof Error
            ? error.message
            : "Unable to start checkout. Please try again."
        );
      }
    } finally {
      setIsCheckoutStarting(false);
    }
  };

  if (result) {
    return <XRayResultView detail={result} onBack={() => setResult(null)} />;
  }

  if (isResultLoading) {
    return (
      <div className={joinClasses(styles.root, styles.loadingState, dark && styles.rootDark)} data-liquid-glass="panel">
        <GraviiLogo decorative variant="motion" className={styles.loadingMark} />
        <span className={styles.loadingTitle}>X-RAYING ON-CHAIN ACTIVITY</span>
        <p className={styles.loadingCopy}>
          {walletInput || "Preparing wallet analysis…"}
        </p>
      </div>
    );
  }

  return (
    <div className={joinClasses(styles.root, dark ? styles.rootDark : styles.rootLight)}>
      <section className={styles.hero} data-liquid-glass="panel">
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>X-RAY</span>
          <h2 className={styles.heroTitle}>
            Read any wallet through Gravii&apos;s identity model.
          </h2>
          <p className={styles.heroText}>
            Run live Gravii analysis, reopen prior lookups, and compare each address
            against the same persona system that powers Gravii ID.
          </p>
        </div>

        <div className={styles.creditPanel} data-liquid-glass="panel">
          <div className={styles.creditTop}>
            <div className={styles.creditGauge} aria-hidden="true">
              <span>{credits === null ? "…" : credits}</span>
            </div>
            <div className={styles.creditCopy}>
              <span className={styles.creditLabel}>ANALYSIS CREDIT</span>
              <strong className={styles.creditValue}>
                {credits === null ? "…" : `${credits} credits remaining`}
              </strong>
            </div>
          </div>

          <div className={styles.statRail}>
            {XRAY_SEARCH_STATS.map((stat) => (
              <div key={stat.label} className={styles.statCard} data-liquid-glass="soft">
                <span className={styles.statLabel}>{stat.label}</span>
                <strong className={styles.statValue}>{stat.value}</strong>
              </div>
            ))}
          </div>

          <div className={styles.creditActions}>
            <ActionButton
              size="panel"
              className={styles.creditButton}
              onClick={handleOpenCheckout}
              disabled={isPanelLoading}
            >
              {connected ? "BUY X-RAY CREDITS" : "SIGN IN TO BUY"}
            </ActionButton>
            <p className={styles.creditHint}>
              Stripe Checkout creates the payment. Backend webhook fulfillment grants credits.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.searchPanel} data-liquid-glass="panel">
        <label className={styles.searchLabel} htmlFor="xray-wallet-input">
          Wallet address
        </label>

        <div className={styles.searchRow}>
          <input
            id="xray-wallet-input"
            ref={walletInputRef}
            className={styles.searchInput}
            data-liquid-glass="soft"
            type="text"
            value={walletInput}
            placeholder="0x000... enter any wallet address"
            onChange={(event) => setWalletInput(event.target.value)}
          />
          <ActionButton
            size="panel"
            className={`${styles.analyzeButton} ${
              !walletInput.trim() ? styles.analyzeButtonEmpty : ""
            }`}
            onClick={() => void handleAnalyze()}
            title={
              !connected
                ? "Sign in before running X-Ray analysis"
                : walletInput.trim()
                  ? "Run X-Ray analysis"
                  : "Enter a wallet address before analysis"
            }
            aria-disabled={!walletInput.trim()}
          >
            {connected ? "ANALYZE" : "SIGN IN TO SEARCH"}
          </ActionButton>
        </div>

        <p className={styles.helperCopy}>
          Connected wallets can inspect themselves for free and reopen history from
          the same workspace.
        </p>

        {errorMessage ? <p className={styles.errorBanner}>{errorMessage}</p> : null}
        {checkoutNotice ? <p className={styles.noticeBanner}>{checkoutNotice}</p> : null}
      </section>

      {!connected ? (
        <section className={styles.restorePanel} data-liquid-glass="panel">
          <div>
            <span className={styles.creditLabel}>SESSION REQUIRED</span>
            <p className={styles.restoreCopy}>
              Restore the Gravii session first, then any EVM address can flow through
              the same X-Ray pipeline.
            </p>
          </div>

          <ActionButton size="panel" className={styles.restoreButton} onClick={onConnect}>
            RESTORE SESSION
          </ActionButton>
        </section>
      ) : (
        <section className={styles.historyPanel} data-liquid-glass="panel">
          <div className={styles.historyHeader}>
            <div>
              <span className={styles.creditLabel}>HISTORY</span>
              <p className={styles.historyCopy}>
                Persisted lookups stay close so you can reopen detail views without
                leaving the panel.
              </p>
            </div>
            <span className={styles.historyCount}>{lookupHistory.length} analyzed</span>
          </div>

          <XRayHistoryList
            currentPage={history.currentPage}
            dark={dark}
            onPageChange={setHistoryPage}
            onSelect={(wallet) => {
              setWalletInput(wallet);
              void openWalletDetail(wallet);
            }}
            rows={history.rows.map((row, index) => ({
              date: formatLookupDate(row.analyzedAt),
              id: `${row.address}-${row.analyzedAt}-${history.currentPage}-${index}`,
              persona: row.topPersona,
              wallet: formatWalletLabel(row.address),
              walletAddress: row.address,
            }))}
            totalCount={lookupHistory.length}
            totalPages={history.totalPages}
          />
        </section>
      )}

      {isCheckoutModalOpen ? (
        <XRayCreditPurchaseModal
          creditBundleLabel={XRAY_CREDIT_BUNDLE.label}
          errorMessage={checkoutError}
          isLoading={isCheckoutStarting}
          onCancel={() => {
            if (!isCheckoutStarting) {
              setIsCheckoutModalOpen(false);
              setCheckoutError(null);
            }
          }}
          onContinue={() => void handleStartCheckout()}
        />
      ) : null}
    </div>
  );
}
