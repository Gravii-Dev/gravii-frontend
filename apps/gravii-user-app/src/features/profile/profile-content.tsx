"use client";

import { useEffect, useState } from "react";

import ActionButton from "@/components/ui/action-button";
import GraviiLogo from "@/components/ui/gravii-logo";
import type { SharedContentProps } from "@/features/launch-app/types";
import { PERSONA_ITEMS } from "@/features/profile/persona-data";
import {
  clearProfileIdentityCache,
  peekProfileIdentity,
  prefetchProfileIdentity,
  storeProfileIdentity,
} from "@/features/profile/profile-identity-cache";
import {
  getProfileDefiValue,
  getProfileNetWorthLabel,
  getProfileSnapshot,
  type ProfileSnapshot,
} from "@/features/profile/profile-view-model";
import { useUserAuth } from "@/features/auth/auth-provider";
import {
  clearUserIdentityBootstrapPending,
  hasPendingUserIdentityBootstrap,
  setPendingXrayWallet,
  readUserIdentity,
  UserApiError,
  type GraviiIdentity,
} from "@/lib/auth/user-api";

import styles from "./profile-content.module.css";

type IdentityLoadState = "idle" | "loading" | "ready" | "error";
type IdentityErrorAction = "refreshSession" | "retryIdentity";

const identityBootstrapRetryCount = 12;
const identityBootstrapRetryDelayMs = 2_500;
const identityFallbackRetryCount = 3;

function joinClasses(...classNames: Array<string | false | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

function personaClass(index: number) {
  return styles[`persona${index}` as keyof typeof styles];
}

function formatWalletLabel(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function wait(delayMs: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, delayMs);
  });
}

function StatCard({
  label,
  meta,
  value,
}: {
  label: string;
  meta: string;
  value: string;
}) {
  return (
    <div className={styles.metricCard}>
      <span className={styles.metricLabel}>{label}</span>
      <strong className={styles.metricValue}>{value}</strong>
      <span className={styles.metricMeta}>{meta}</span>
    </div>
  );
}

function PreviewCard({
  label,
  meta,
  value,
}: {
  label: string;
  meta: string;
  value: string;
}) {
  return (
    <div className={styles.previewCard}>
      <span className={styles.previewLabel}>{label}</span>
      <strong className={styles.previewValue}>{value}</strong>
      <span className={styles.previewMeta}>{meta}</span>
    </div>
  );
}

function ProfileHydratingState() {
  return (
    <div className={styles.connectedStack} aria-hidden="true">
      <section className={styles.heroPanel}>
        <div className={styles.heroCopy}>
          <span className={styles.heroEyebrow}>PRIMARY PERSONA</span>
          <div className={`${styles.skeletonBlock} ${styles.skeletonTitle}`} />
          <div className={`${styles.skeletonBlock} ${styles.skeletonBody}`} />

          <div className={styles.badgeRow}>
            <span className={`${styles.skeletonChip} ${styles.skeletonChipStrong}`} />
            <span className={styles.skeletonChip} />
            <span className={styles.skeletonChip} />
          </div>

          <div className={styles.actionRow}>
            <span className={`${styles.skeletonButton} ${styles.skeletonButtonDark}`} />
            <span className={styles.skeletonButton} />
          </div>
        </div>

        <div className={styles.heroSignal}>
          <div className={`${styles.skeletonPanel} ${styles.skeletonPanelLarge}`} />
          <div className={styles.skeletonPanel} />
        </div>
      </section>

      <div className={styles.metricGrid}>
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className={styles.metricCard}>
            <span className={styles.metricLabel}>Loading</span>
            <div className={`${styles.skeletonBlock} ${styles.skeletonMetric}`} />
            <div className={`${styles.skeletonBlock} ${styles.skeletonMetricMeta}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

function LockedProfileState({
  connected,
  errorAction,
  errorMessage,
  identityStatus,
  onConnect,
  onRefreshSession,
  onRetry,
}: {
  connected: boolean;
  errorAction: IdentityErrorAction;
  errorMessage: string | null;
  identityStatus: IdentityLoadState;
  onConnect: () => void;
  onRefreshSession: () => void;
  onRetry: () => void;
}) {
  const eyebrow =
    identityStatus === "loading"
      ? "BUILDING YOUR GRAVII ID"
      : identityStatus === "error"
        ? "GRAVII ID UNAVAILABLE"
        : "SIGN IN TO REVEAL";
  const title =
    identityStatus === "loading"
      ? "We are reading your wallet footprint."
      : identityStatus === "error"
        ? "The identity layer could not hydrate."
        : "Identity settles after the session restores.";
  const copy =
    identityStatus === "loading"
      ? "Gravii is scanning on-chain activity across your recent footprint and composing the first persona readout."
      : identityStatus === "error"
        ? errorMessage ??
          "We could not read your Gravii ID right now. Refresh the session or retry the identity call."
        : "Restore your Gravii session to reveal persona, tier, wallet momentum, and the fastest route into X-Ray.";
  const actionLabel =
    identityStatus === "loading"
      ? undefined
      : identityStatus === "error"
        ? errorAction === "refreshSession"
          ? "Refresh Session"
          : "Retry Identity"
        : "Restore Session";
  const action =
    identityStatus === "loading"
      ? undefined
      : identityStatus === "error"
        ? errorAction === "refreshSession"
          ? onRefreshSession
          : onRetry
        : onConnect;

  return (
    <div className={styles.lockedState}>
      <section className={styles.lockedHero}>
        <GraviiLogo
          decorative
          variant={connected && identityStatus === "loading" ? "motion" : "symbol"}
          className={styles.brandSymbol}
        />

        <div className={styles.lockedCopyBlock}>
          <span className={styles.lockedEyebrow}>{eyebrow}</span>
          <h3 className={styles.lockedTitle}>{title}</h3>
          <p className={styles.lockedCopy}>{copy}</p>
        </div>

        {action && actionLabel ? (
          <ActionButton size="panel" className={styles.lockedAction} onClick={action}>
            {actionLabel}
          </ActionButton>
        ) : (
          <span className={styles.lockedActionSecondary}>Hydrating…</span>
        )}
      </section>

      <div className={styles.previewGrid}>
        <PreviewCard label="PERSONA GRAPH" meta="Top persona + adjacent signals" value="LOCKED" />
        <PreviewCard label="NET WORTH" meta="Live USD aggregation" value="••••••" />
        <PreviewCard label="ROUTE READY" meta="X-Ray and My Space entry points" value="STANDBY" />
      </div>
    </div>
  );
}

function ConnectedProfileState({
  identity,
  onNavigate,
  personaName,
  personaQuote,
  snapshot,
}: {
  identity: GraviiIdentity;
  onNavigate?: SharedContentProps["onNavigate"];
  personaName: string;
  personaQuote: string;
  snapshot: ProfileSnapshot;
}) {
  return (
    <div className={styles.connectedStack}>
      <section className={styles.heroPanel}>
        <div className={styles.heroCopy}>
          <span className={styles.heroEyebrow}>PRIMARY PERSONA</span>
          <h3 className={styles.heroTitle}>{personaName}</h3>
          <p className={styles.heroQuote}>{personaQuote}</p>

          <div className={styles.badgeRow}>
            <span className={styles.tierBadge}>{snapshot.tier}</span>
            <span className={styles.subtleBadge}>Active since {snapshot.activeSince}</span>
            <span className={styles.subtleBadge}>{formatWalletLabel(identity.address)}</span>
          </div>

          <div className={styles.actionRow}>
            <ActionButton
              size="panel"
              className={styles.primaryAction}
              onClick={() => {
                setPendingXrayWallet(identity.address);
                onNavigate?.("lookup");
              }}
            >
              Open X-Ray
            </ActionButton>
            <ActionButton
              size="panel"
              className={styles.secondaryAction}
              onClick={() => {
                const text = encodeURIComponent(
                  `I'm a ${personaName} on @Gravii — ${snapshot.tier} tier with ${getProfileNetWorthLabel(identity)} on-chain.`
                );

                window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
              }}
            >
              Share on X
            </ActionButton>
          </div>
        </div>

        <div className={styles.heroSignal}>
          <div className={styles.personaSignalCard} aria-hidden="true">
            <span className={styles.signalLabel}>PERSONA SIGNAL</span>
            <strong className={styles.personaSignalValue}>{snapshot.reputation}</strong>
            <span className={styles.personaSignalMeta}>
              {snapshot.tier} tier · {snapshot.homeChain} anchor
            </span>
            <div className={styles.signalBars}>
              <span className={styles.signalBarStrong} />
              <span className={styles.signalBarMedium} />
              <span className={styles.signalBarSoft} />
            </div>
          </div>

          <div className={styles.signalCard}>
            <span className={styles.signalLabel}>NET WORTH</span>
            <strong className={styles.signalValue}>{getProfileNetWorthLabel(identity)}</strong>
            <span className={styles.signalMeta}>
              {snapshot.homeChain} anchor · {snapshot.trend} over the last 30 days
            </span>
          </div>
        </div>
      </section>

      <div className={styles.metricGrid}>
        <StatCard
          label="HOME CHAIN"
          meta={snapshot.homeChainMeta}
          value={snapshot.homeChain}
        />
        <StatCard
          label="TRANSACTIONS"
          meta="Last 90 days"
          value={snapshot.transactionCount}
        />
        <StatCard
          label="DEFI TVL"
          meta={snapshot.defiMeta}
          value={getProfileDefiValue(identity)}
        />
        <StatCard
          label="REPUTATION"
          meta={snapshot.reputationFlags}
          value={snapshot.reputation}
        />
        <StatCard
          label="30D MOMENTUM"
          meta={`Volume ${snapshot.trendMeta}`}
          value={snapshot.trend}
        />
        <StatCard
          label="ANALYZED"
          meta="Last identity refresh"
          value={snapshot.analyzedAt}
        />
      </div>

      <div className={styles.lowerGrid}>
        <section className={styles.secondaryPanel}>
          <span className={styles.panelTitle}>ALSO READS AS</span>
          <div className={styles.personaList}>
            {identity.adjacentPersonas.length > 0 ? (
              identity.adjacentPersonas.slice(0, 4).map((persona) => (
                <span key={persona} className={styles.personaChip}>
                  {persona}
                </span>
              ))
            ) : (
              <span className={styles.personaChip}>No adjacent personas yet</span>
            )}
          </div>
          <p className={styles.bodyText}>
            Gravii keeps your persona anchored to one working identity while still
            surfacing the edge patterns that shape eligibility and next actions.
          </p>
        </section>

        <section className={styles.routePanel}>
          <button
            type="button"
            className={styles.routeCard}
            onClick={() => {
              setPendingXrayWallet(identity.address);
              onNavigate?.("lookup");
            }}
          >
            <span className={styles.routeLabel}>X-RAY</span>
            <strong className={styles.routeValue}>Inspect your wallet live</strong>
            <p className={styles.routeCopy}>
              Reopen the same address inside Gravii&apos;s analysis workspace and
              compare this persona against live wallet behavior.
            </p>
            <span className={styles.routeMeta}>Launch wallet analysis →</span>
          </button>

          <button
            type="button"
            className={styles.routeCard}
            onClick={() => onNavigate?.("myspace")}
          >
            <span className={styles.routeLabel}>MY SPACE</span>
            <strong className={styles.routeValue}>Personalized space is next</strong>
            <p className={styles.routeCopy}>
              Keep this route warm for matched campaigns, curated drops, and
              persona-led recommendations once the surface goes live.
            </p>
            <span className={styles.routeMeta}>Preview reserved slot →</span>
          </button>
        </section>
      </div>
    </div>
  );
}

export default function ProfileContent({
  dark,
  connected,
  onConnect,
  onNavigate,
}: SharedContentProps) {
  const auth = useUserAuth();
  const [identity, setIdentity] = useState<GraviiIdentity | null>(() => (connected ? peekProfileIdentity() : null));
  const [identityStatus, setIdentityStatus] = useState<IdentityLoadState>(() =>
    connected ? (peekProfileIdentity() ? "ready" : "loading") : "idle"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorAction, setErrorAction] =
    useState<IdentityErrorAction>("retryIdentity");
  const [identityReloadKey, setIdentityReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    if (!connected) {
      clearUserIdentityBootstrapPending();
      clearProfileIdentityCache();
      setIdentity(null);
      setIdentityStatus("idle");
      setErrorMessage(null);
      setErrorAction("retryIdentity");

      return () => {
        cancelled = true;
      };
    }

    const loadIdentity = async () => {
      const cachedIdentity = peekProfileIdentity();

      if (cachedIdentity) {
        setIdentity(cachedIdentity);
        setIdentityStatus("ready");
      } else {
        setIdentityStatus("loading");

        const primedIdentity = await prefetchProfileIdentity();

        if (cancelled) {
          return;
        }

        if (primedIdentity) {
          setIdentity(primedIdentity);
          setIdentityStatus("ready");
          setErrorMessage(null);
          return;
        }
      }

      setErrorMessage(null);
      setErrorAction("retryIdentity");

      const hasBootstrapPending = hasPendingUserIdentityBootstrap();
      const maxAttempts = hasBootstrapPending
        ? identityBootstrapRetryCount
        : identityFallbackRetryCount;

      for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        try {
          const nextIdentity = await readUserIdentity();

          if (!cancelled) {
            clearUserIdentityBootstrapPending();
            storeProfileIdentity(nextIdentity);
            setIdentity(nextIdentity);
            setIdentityStatus("ready");
          }

          return;
        } catch (error) {
          if (cancelled) {
            return;
          }

          if (error instanceof UserApiError && error.status === 404) {
            const isLastAttempt = attempt === maxAttempts - 1;

            if (!isLastAttempt) {
              await wait(identityBootstrapRetryDelayMs);
              continue;
            }

            const fallbackIdentity = peekProfileIdentity();

            if (fallbackIdentity) {
              setIdentity(fallbackIdentity);
              setIdentityStatus("ready");
              setErrorMessage(null);

              return;
            }

            setIdentity(null);
            setIdentityStatus("error");
            setErrorAction("retryIdentity");
            setErrorMessage(
              "Your Gravii ID is still being prepared. Give it a few more seconds, then try loading the card again."
            );

            return;
          }

          const fallbackIdentity = peekProfileIdentity();

          if (fallbackIdentity) {
            setIdentity(fallbackIdentity);
            setIdentityStatus("ready");
            setErrorMessage(null);

            return;
          }

          setIdentity(null);
          setIdentityStatus("error");
          setErrorAction(
            error instanceof UserApiError && error.status === 401
              ? "refreshSession"
              : "retryIdentity"
          );
          setErrorMessage(
            error instanceof Error ? error.message : "Unable to load your Gravii ID."
          );

          return;
        }
      }

      if (!cancelled) {
        const fallbackIdentity = peekProfileIdentity();

        if (fallbackIdentity) {
          setIdentity(fallbackIdentity);
          setIdentityStatus("ready");
          setErrorMessage(null);

          return;
        }

        setIdentity(null);
        setIdentityStatus("error");
        setErrorAction("retryIdentity");
        setErrorMessage("Unable to load your Gravii ID.");
      }
    };

    void loadIdentity();

    return () => {
      cancelled = true;
    };
  }, [connected, identityReloadKey]);

  const snapshot =
    identityStatus === "ready" && identity ? getProfileSnapshot(identity) : null;
  const persona = snapshot ? PERSONA_ITEMS[snapshot.personaIndex] : null;
  const isHydratingConnectedProfile =
    connected && identityStatus === "loading" && identity === null;
  const connectedProfile =
    connected && identityStatus === "ready" && identity && snapshot && persona
      ? { identity, persona, snapshot }
      : null;

  return (
    <div
      className={joinClasses(
        styles.root,
        dark ? styles.rootDark : styles.rootLight,
        connectedProfile ? styles.rootReady : undefined,
        snapshot ? personaClass(snapshot.personaIndex) : undefined
      )}
    >
      <div className={styles.atmosphere} />

      {connectedProfile ? (
        <div className={styles.identityBar}>
          <div className={styles.identityBarCopy}>
            <span className={styles.kicker}>GRAVII ID READY</span>
            <strong className={styles.identityBarTitle}>
              {connectedProfile.snapshot.tier} persona graph live
            </strong>
          </div>

          <div className={styles.identityBarMeta}>
            <span>{formatWalletLabel(connectedProfile.identity.address)}</span>
            <span>{connectedProfile.snapshot.analyzedAt}</span>
          </div>
        </div>
      ) : isHydratingConnectedProfile ? null : (
        <div className={styles.headerBand}>
          <div className={styles.headerCopy}>
            <span className={styles.kicker}>GRAVII ID</span>
            <h2 className={styles.title}>
              Identity that settles into every wallet signal.
            </h2>
            <p className={styles.copy}>
              Gravii reads live on-chain behavior, composes a working persona, and
              keeps your next analytical step one tap away.
            </p>
          </div>

          <div className={styles.brandWell}>
            <GraviiLogo
              decorative
              variant={connected && identityStatus === "loading" ? "motion" : "symbol"}
              className={styles.brandSymbol}
            />
            <GraviiLogo decorative variant="wordmark" className={styles.brandWordmark} />
            <p className={styles.brandMeta}>
              {connected
                ? "Live identity session"
                : "Restore a session to reveal the first readout"}
            </p>
          </div>
        </div>
      )}

      {connectedProfile ? (
        <ConnectedProfileState
          identity={connectedProfile.identity}
          onNavigate={onNavigate}
          personaName={connectedProfile.persona.name}
          personaQuote={connectedProfile.persona.desc}
          snapshot={connectedProfile.snapshot}
        />
      ) : isHydratingConnectedProfile ? (
        <ProfileHydratingState />
      ) : (
        <LockedProfileState
          connected={connected}
          errorAction={errorAction}
          errorMessage={errorMessage}
          identityStatus={identityStatus}
          onConnect={onConnect}
          onRefreshSession={() => void auth.refreshSession()}
          onRetry={() => setIdentityReloadKey((current) => current + 1)}
        />
      )}
    </div>
  );
}
