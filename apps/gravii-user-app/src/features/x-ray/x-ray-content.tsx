"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getAddress } from "viem";

import ActionButton from "@/components/ui/action-button";
import GraviiLogo from "@/components/ui/gravii-logo";
import type { SharedContentProps } from "@/features/launch-app/types";
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
  popPendingXrayWallet,
  readUserCredits,
  readUserLookupList,
  readUserXrayDetail,
  runUserXrayLookup,
} from "@/lib/auth/user-api";

import styles from "./x-ray-content.module.css";

function joinClasses(...classNames: Array<string | false | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export default function XRayContent({ dark, connected, onConnect }: SharedContentProps) {
  const [credits, setCredits] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [historyPage, setHistoryPage] = useState(0);
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
      setErrorMessage(
        error instanceof Error ? error.message : "Analysis failed. Please try again."
      );
    } finally {
      setIsResultLoading(false);
    }
  };

  if (result) {
    return <XRayResultView detail={result} onBack={() => setResult(null)} />;
  }

  if (isResultLoading) {
    return (
      <div className={joinClasses(styles.root, styles.loadingState, dark && styles.rootDark)}>
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
      <section className={styles.hero}>
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

        <div className={styles.creditPanel}>
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
              <div key={stat.label} className={styles.statCard}>
                <span className={styles.statLabel}>{stat.label}</span>
                <strong className={styles.statValue}>{stat.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.searchPanel}>
        <label className={styles.searchLabel} htmlFor="xray-wallet-input">
          Wallet address
        </label>

        <div className={styles.searchRow}>
          <input
            id="xray-wallet-input"
            ref={walletInputRef}
            className={styles.searchInput}
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
            backChildren={
              walletInput.trim() ? "RUN X-RAY" : "ENTER WALLET ADDRESS"
            }
            aria-disabled={!walletInput.trim()}
          >
            ANALYZE
          </ActionButton>
        </div>

        <p className={styles.helperCopy}>
          Connected wallets can inspect themselves for free and reopen history from
          the same workspace.
        </p>

        {errorMessage ? <p className={styles.errorBanner}>{errorMessage}</p> : null}
      </section>

      {!connected ? (
        <section className={styles.restorePanel}>
          <div>
            <span className={styles.creditLabel}>SESSION REQUIRED</span>
            <p className={styles.restoreCopy}>
              Restore the Gravii session first, then any EVM address can flow through
              the same X-Ray pipeline.
            </p>
          </div>

          <ActionButton size="panel" className={styles.restoreButton} onClick={onConnect}>
            RESTORE SESSION TO START ANALYZING
          </ActionButton>
        </section>
      ) : (
        <section className={styles.historyPanel}>
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
    </div>
  );
}
