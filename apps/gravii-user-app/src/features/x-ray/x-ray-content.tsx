"use client";

import { useEffect, useRef, useState } from "react";

import type { SharedContentProps } from "@/features/launch-app/types";
import XRayHistoryList from "@/features/x-ray/components/x-ray-history-list";
import XRayPayModal from "@/features/x-ray/components/x-ray-pay-modal";
import XRayResultView from "@/features/x-ray/components/x-ray-result-view";
import { XRAY_PRICE_LABEL, XRAY_SEARCH_STATS, getAnalysisHistoryPage } from "@/features/x-ray/x-ray-view-model";

import styles from "./x-ray-content.module.css";

export default function XRayContent({ dark, connected, onConnect }: SharedContentProps) {
  const [walletInput, setWalletInput] = useState("");
  const [showPayModal, setShowPayModal] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [resultWallet, setResultWallet] = useState<string | null>(null);
  const [historyPage, setHistoryPage] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const history = getAnalysisHistoryPage(historyPage);

  const handleAnalyze = () => {
    if (!connected || !walletInput.trim()) {
      return;
    }

    setShowPayModal(true);
  };

  const handleConfirmPay = () => {
    setShowPayModal(false);
    setAnalyzing(true);
    timerRef.current = window.setTimeout(() => {
      setAnalyzing(false);
      setResultWallet(walletInput.trim());
    }, 2200);
  };

  if (resultWallet) {
    return <XRayResultView wallet={resultWallet} onBack={() => setResultWallet(null)} />;
  }

  if (analyzing) {
    return (
      <div className={`${styles.root} ${styles.loadingState} ${styles.dashboardStage}`}>
        <div className={styles.loadingSpinner} />
        <p className={styles.loadingTitle}>ANALYZING WALLET</p>
        <p className={styles.loadingCopy}>{walletInput || "0x..."}</p>
      </div>
    );
  }

  return (
    <div className={`${styles.root} ${dark ? styles.rootDark : styles.rootLight}`}>
      {showPayModal ? <XRayPayModal priceLabel={XRAY_PRICE_LABEL} onCancel={() => setShowPayModal(false)} onConfirm={handleConfirmPay} /> : null}

      <p className={styles.lead}>Deep-dive into any wallet&apos;s footprint.</p>
      <p className={styles.copy}>Unlock the in-depth Dashboard to analyze any wallet address through the Gravii intelligence layer.</p>
      <p className={styles.hint}>* All transactions are final.</p>

      <div className={styles.searchRow}>
        <label className={styles.srOnly} htmlFor="xray-wallet-input">
          Wallet address
        </label>
        <input
          id="xray-wallet-input"
          className={styles.searchInput}
          type="text"
          value={walletInput}
          placeholder="0x000... enter any wallet address"
          onChange={(event) => setWalletInput(event.target.value)}
        />
        <button type="button" className={styles.analyzeButton} onClick={handleAnalyze} disabled={!connected || !walletInput.trim()}>
          ANALYZE
        </button>
      </div>

      <div className={styles.searchStats}>
        {XRAY_SEARCH_STATS.map((stat) => (
          <div key={stat.label} className={styles.statCard}>
            <div className={styles.statValue}>{stat.value}</div>
            <span className={styles.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>

      {!connected ? (
        <div className={styles.signInRow}>
          <button type="button" className={styles.signInButton} onClick={onConnect}>
            SIGN IN TO START ANALYZING
          </button>
        </div>
      ) : null}

      {connected ? (
        <div className={styles.historySection}>
          <div className={styles.historyDivider} />
          <XRayHistoryList
            rows={history.rows}
            totalCount={history.totalCount}
            currentPage={history.currentPage}
            totalPages={history.totalPages}
            dark={dark}
            onPageChange={setHistoryPage}
            onSelect={(wallet) => {
              setWalletInput(wallet);
              setResultWallet(wallet);
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
