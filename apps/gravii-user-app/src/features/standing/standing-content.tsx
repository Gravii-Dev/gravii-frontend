"use client";

import { useEffect, useMemo, useState } from "react";

import ActionButton from "@/components/ui/action-button";
import type { SharedContentProps } from "@/features/launch-app/types";
import {
  readRankingLeaderboard,
  readUserRankingSummary,
  type RankingCategoryId,
  type RankingRow,
  type UserRankingSummary,
  UserApiError,
} from "@/lib/auth/user-api";

import styles from "./standing-content.module.css";

type RankingCategory = {
  id: RankingCategoryId;
  label: string;
  description: string;
};

type RankingLoadStatus = "error" | "loading" | "ready" | "unavailable";

type RankingBoardState = {
  generatedAt?: string | null;
  message?: string;
  rows: RankingRow[];
  seasonLabel?: string | null;
  status: RankingLoadStatus;
  updateLabel?: string | null;
};

type UserRankingState = {
  message?: string;
  status: RankingLoadStatus;
  summary: UserRankingSummary | null;
};

const CATEGORIES: RankingCategory[] = [
  {
    description: "Your Gravii reputation, based on holdings, activity, trading, and consistency.",
    id: "g-rep",
    label: "G-REP",
  },
  {
    description: "How active you are across transaction frequency, volume, and cross-chain participation.",
    id: "activity",
    label: "ACTIVITY",
  },
  {
    description: "How well you trade across volume, timing, and execution behavior.",
    id: "trade",
    label: "TRADE",
  },
  {
    description: "How consistent you are across consecutive days of verified on-chain participation.",
    id: "streak",
    label: "STREAK",
  },
  {
    description: "Your presence in the NFT ecosystem across collection and trading behavior.",
    id: "nft",
    label: "NFT",
  },
];

const emptyBoardState: RankingBoardState = {
  rows: [],
  status: "loading",
};

const emptyUserRankingState: UserRankingState = {
  status: "loading",
  summary: null,
};

function tierClassName(tier: RankingRow["tier"]) {
  if (tier === "Obsidian") {
    return styles.tierObsidian;
  }

  if (tier === "Black") {
    return styles.tierBlack;
  }

  if (tier === "Platinum") {
    return styles.tierPlatinum;
  }

  if (tier === "Gold") {
    return styles.tierGold;
  }

  if (tier === "Base") {
    return styles.tierBase;
  }

  return styles.tierClassic;
}

function movementClassName(row: RankingRow) {
  if (row.up === true) {
    return styles.moveUp;
  }

  if (row.up === false) {
    return styles.moveDown;
  }

  return styles.moveFlat;
}

function getBoardStatusCopy(state: RankingBoardState) {
  if (state.status === "loading") {
    return "LOADING";
  }

  if (state.status === "error") {
    return "CHECK API";
  }

  if (state.status === "unavailable") {
    return "API READY";
  }

  return state.updateLabel ?? "UPDATED DAILY";
}

export default function StandingContent({
  connected,
  dark,
  onConnect,
  onNavigate,
}: SharedContentProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<RankingCategoryId>("g-rep");
  const [boardState, setBoardState] = useState<RankingBoardState>(emptyBoardState);
  const [userRankingState, setUserRankingState] = useState<UserRankingState>(emptyUserRankingState);
  const activeCategory = useMemo(
    () => CATEGORIES.find((category) => category.id === activeCategoryId) ?? CATEGORIES[0],
    [activeCategoryId]
  );
  const rows = boardState.rows;
  const userRanking = userRankingState.summary;

  useEffect(() => {
    const controller = new AbortController();

    readRankingLeaderboard(activeCategoryId, { signal: controller.signal })
      .then((leaderboard) => {
        setBoardState({
          generatedAt: leaderboard.generatedAt,
          rows: leaderboard.rows,
          seasonLabel: leaderboard.seasonLabel,
          status: "ready",
          updateLabel: leaderboard.updateLabel,
        });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        if (error instanceof UserApiError && (error.status === 404 || error.status === 501)) {
          setBoardState({
            message: "Public ranking rows will render here when the Ranking API is enabled.",
            rows: [],
            status: "unavailable",
          });
          return;
        }

        setBoardState({
          message:
            error instanceof Error ? error.message : "Unable to load the ranking board.",
          rows: [],
          status: "error",
        });
      });

    return () => {
      controller.abort();
    };
  }, [activeCategoryId]);

  useEffect(() => {
    if (!connected) {
      return;
    }

    const controller = new AbortController();

    readUserRankingSummary({ signal: controller.signal })
      .then((summary) => {
        setUserRankingState({
          status: "ready",
          summary,
        });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        if (error instanceof UserApiError && (error.status === 404 || error.status === 501)) {
          setUserRankingState({
            message: "Your wallet ranking will appear when the signed ranking endpoint is enabled.",
            status: "unavailable",
            summary: null,
          });
          return;
        }

        setUserRankingState({
          message:
            error instanceof Error ? error.message : "Unable to load your wallet ranking.",
          status: "error",
          summary: null,
        });
      });

    return () => {
      controller.abort();
    };
  }, [connected]);

  return (
    <div className={`${styles.root} ${dark ? styles.rootDark : styles.rootLight}`}>
      <section className={styles.seasonBar} aria-label="Ranking season status">
        <div className={styles.seasonMeta}>
          <span className={styles.eyebrow}>Season</span>
          <strong>{boardState.seasonLabel ?? "Pending API"}</strong>
        </div>
        <span className={styles.seasonCountdown}>
          {boardState.generatedAt
            ? `Generated ${new Date(boardState.generatedAt).toLocaleDateString()}`
            : "Season timing will load from Ranking API"}
        </span>
        <div className={styles.seasonProgress} aria-hidden="true">
          <span />
        </div>
      </section>

      <section className={styles.hero} aria-label="Ranking overview">
        <div>
          <span className={styles.eyebrow}>Standing</span>
          <h2>See where you stand.</h2>
        </div>
        <p>
          Rankings update daily from on-chain behavior. Public boards stay visible;
          your personal wallet rank requires a signed Gravii session.
        </p>
      </section>

      <section className={styles.youPanel} aria-label="Personal wallet ranking">
        {connected ? (
          <div className={styles.youGrid}>
            <div>
              <span className={styles.eyebrow}>You</span>
              <strong>{userRanking?.connectedWalletLabel ?? "Connected wallet"}</strong>
            </div>
            <div>
              <span className={styles.eyebrow}>Season rank</span>
              <strong>{userRanking?.seasonRank ?? "Pending API"}</strong>
              <span>
                {userRanking?.totalRankedWallets
                  ? `of ${userRanking.totalRankedWallets.toLocaleString()} ranked wallets`
                  : "of total ranked wallets"}
              </span>
            </div>
            <div>
              <span className={styles.eyebrow}>Season best</span>
              <strong>{userRanking?.seasonBest ?? "-"}</strong>
              <span>{userRankingState.message ?? "Best category will load here."}</span>
            </div>
            <div>
              <span className={styles.eyebrow}>Season change</span>
              <strong>{userRanking?.seasonChange ?? "-"}</strong>
              <span>Movement since season start.</span>
            </div>
          </div>
        ) : (
          <div className={styles.lockedYou}>
            <div>
              <span className={styles.eyebrow}>My wallet rank</span>
              <strong>Get your Gravii ID</strong>
              <p>
                See where you stand among peers. Sign in to calculate your own
                wallet rank, tier, and movement against this category.
              </p>
              <span className={styles.complimentaryNote}>Complimentary — no strings.</span>
            </div>
            <ActionButton size="panel" className={styles.signInButton} onClick={onConnect}>
              SIGN IN
            </ActionButton>
          </div>
        )}
      </section>

      <section className={styles.categoryBar} aria-label="Ranking categories">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            className={category.id === activeCategoryId ? styles.categoryActive : styles.categoryButton}
            onClick={() => setActiveCategoryId(category.id)}
          >
            {category.label}
          </button>
        ))}
      </section>

      <p className={styles.categoryDescription}>{activeCategory.description}</p>

      <section className={styles.board} aria-label={`${activeCategory.label} ranking board`}>
        <div className={styles.boardIntro}>
          <div>
            <span className={styles.eyebrow}>{activeCategory.label} board</span>
            <p>{activeCategory.description}</p>
          </div>
          <span className={styles.updatePill} data-state={boardState.status}>
            {getBoardStatusCopy(boardState)}
          </span>
        </div>

        <div className={styles.boardHeader}>
          <span>#</span>
          <span>Tier</span>
          <span>Name</span>
          <span>Persona</span>
          <span>Chain</span>
          <span>Change</span>
        </div>

        {connected ? (
          <>
            <article className={`${styles.row} ${styles.youRow}`}>
              <strong>Pending</strong>
              <span className={tierClassName("Base")}>Base</span>
              <span>Your wallet</span>
              <span>Persona pending</span>
              <span>—</span>
              <span>—</span>
            </article>
            <div className={styles.rankGap}>· · ·</div>
          </>
        ) : null}

        <div className={styles.rows}>
          {rows.length === 0 ? (
            <div className={styles.emptyRows} data-state={boardState.status}>
              <strong>
                {boardState.status === "loading"
                  ? "Loading ranking board."
                  : boardState.status === "error"
                    ? "Ranking board could not load."
                    : "Ranking board is ready for live data."}
              </strong>
              <span>
                {boardState.message ?? "Rows will render here from the live Ranking API."}
              </span>
            </div>
          ) : null}

          {rows.map((row) => (
            <article className={styles.row} key={`${activeCategoryId}-${row.rank}-${row.name}`}>
              <strong>{row.rank}</strong>
              <span className={tierClassName(row.tier)}>{row.tier}</span>
              <span>{row.name}</span>
              <span>{row.persona}</span>
              <span>{row.chain}</span>
              <span className={movementClassName(row)}>{row.change === "0" ? "—" : row.change}</span>
            </article>
          ))}
        </div>
      </section>

      {connected ? (
        <>
          <section className={styles.lastSeason} aria-label="Last season ranking summary">
            <span className={styles.eyebrow}>Last season</span>
            <div className={styles.lastSeasonGrid}>
              {CATEGORIES.map((category) => (
                <div key={`last-season-${category.id}`}>
                  <span>{category.label}</span>
                  <strong>{userRanking?.categoryRanks[category.id] ?? "Pending API"}</strong>
                </div>
              ))}
            </div>
          </section>
          <ActionButton
            size="panel"
            className={styles.profileButton}
            onClick={() => onNavigate?.("profile")}
          >
            REVIEW GRAVII ID
          </ActionButton>
        </>
      ) : null}
    </div>
  );
}
