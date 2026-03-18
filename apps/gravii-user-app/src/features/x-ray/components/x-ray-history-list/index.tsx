"use client";

import styles from "./x-ray-history-list.module.css";

type AnalysisHistoryRow = {
  date: string;
  wallet: string;
  persona: string;
};

type XRayHistoryListProps = {
  rows: AnalysisHistoryRow[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  dark: boolean;
  onPageChange: (page: number) => void;
  onSelect: (wallet: string) => void;
};

function joinClasses(...classNames: Array<string | false | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export default function XRayHistoryList({
  rows,
  totalCount,
  currentPage,
  totalPages,
  dark,
  onPageChange,
  onSelect,
}: XRayHistoryListProps) {
  return (
    <div className={joinClasses(styles.root, dark ? styles.rootDark : styles.rootLight)}>
      <div className={styles.header}>
        <span className={styles.title}>ANALYSIS HISTORY</span>
        <span className={styles.count}>{totalCount} analyzed</span>
      </div>

      <div className={styles.list}>
        {rows.map((row) => (
          <button key={`${row.date}-${row.wallet}`} type="button" className={styles.row} onClick={() => onSelect(row.wallet)}>
            <span className={styles.rowMeta}>{row.date}</span>
            <span className={styles.wallet}>{row.wallet}</span>
            <span className={styles.persona}>{row.persona}</span>
            <span className={styles.rowMeta}>→</span>
          </button>
        ))}
      </div>

      <div className={styles.pagination}>
        <button type="button" className={`${styles.pageButton} ${styles.pageNavButton}`} disabled={currentPage === 0} onClick={() => onPageChange(currentPage - 1)}>
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            type="button"
            className={joinClasses(styles.pageButton, styles.pageIndexButton, index === currentPage && styles.pageActive)}
            onClick={() => onPageChange(index)}
          >
            {index + 1}
          </button>
        ))}

        <button type="button" className={`${styles.pageButton} ${styles.pageNavButton}`} disabled={currentPage >= totalPages - 1} onClick={() => onPageChange(currentPage + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
