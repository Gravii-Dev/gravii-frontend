"use client";

import styles from "./discovery-filters.module.css";

type DiscoveryFiltersProps = {
  categories: readonly string[];
  activeCategory: string;
  statuses: readonly string[];
  activeStatus: string;
  searchQuery: string;
  onCategoryChange: (category: string) => void;
  onStatusChange: (status: string) => void;
  onSearchChange: (value: string) => void;
};

function joinClasses(...classNames: Array<string | false | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export default function DiscoveryFilters({
  categories,
  activeCategory,
  statuses,
  activeStatus,
  searchQuery,
  onCategoryChange,
  onStatusChange,
  onSearchChange,
}: DiscoveryFiltersProps) {
  return (
    <div className={styles.root}>
      <div className={styles.row}>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={joinClasses(styles.chip, activeCategory === category && styles.chipActive)}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className={styles.row}>
        {statuses.map((status) => (
          <button
            key={status}
            type="button"
            className={joinClasses(styles.chip, activeStatus === status && styles.chipActive)}
            onClick={() => onStatusChange(status)}
          >
            {status}
          </button>
        ))}

        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <label className={styles.srOnly} htmlFor="discovery-search">
            Search partners
          </label>
          <input
            id="discovery-search"
            className={styles.searchInput}
            type="text"
            value={searchQuery}
            placeholder="Search partners..."
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
