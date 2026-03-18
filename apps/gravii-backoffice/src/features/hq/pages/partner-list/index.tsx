import { getPrototypeWindow } from "@/features/hq/lib/prototype-window";

export function PrototypePartnerListPage() {
  const handleFilterClick = (element: HTMLElement) => {
    getPrototypeWindow().togF?.(element);
  };

  return (
    <div className="page" id="page-partner-list">
      <div className="fade-in" style={{ marginBottom: "12px" }}>
        <input
          type="text"
          id="pl-search"
          onInput={() => getPrototypeWindow().filterPartnerList?.()}
          placeholder="Search partners..."
          style={{
            width: "100%",
            padding: "12px 16px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            color: "var(--text)",
            fontSize: "14px",
            fontFamily: "'Outfit',sans-serif",
            outline: "none",
            transition: "border-color 0.2s"
          }}
          onFocus={(event) => {
            event.currentTarget.style.borderColor = "var(--hq)";
          }}
          onBlur={(event) => {
            event.currentTarget.style.borderColor = "var(--border)";
          }}
        />
      </div>
      <div className="filter-bar fade-in">
        <div className="filter-bar-label">Filter</div>
        <div className="filter-group">
          <span className="fbtn f-active" onClick={(event) => handleFilterClick(event.currentTarget)}>
            All Status
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Active
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Review
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Flagged
          </span>
        </div>
        <div className="filter-sep" />
        <div className="filter-group">
          <span className="fbtn f-active" onClick={(event) => handleFilterClick(event.currentTarget)}>
            All Plans
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Free
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Starter
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Growth
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Enterprise
          </span>
        </div>
        <div className="filter-sep" />
        <div className="filter-group">
          <span className="fbtn f-active" onClick={(event) => handleFilterClick(event.currentTarget)}>
            All Products
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Reach
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Gate
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Lens
          </span>
        </div>
        <button
          className="fbtn-reset"
          onClick={(event) => getPrototypeWindow().resetF?.(event.currentTarget)}
        >
          Reset
        </button>
      </div>

      <div id="pl-stats" className="stat-grid fade-in fade-d1" />
      <div className="card fade-in fade-d2">
        <div className="sec-head">
          <div className="sec-title">All Partners</div>
        </div>
        <div style={{ overflowX: "auto" }} id="pl-table" />
        <div
          style={{
            marginTop: "12px",
            fontSize: "12px",
            color: "var(--textD)",
            fontStyle: "italic"
          }}
          id="pl-footer"
        />
      </div>
    </div>
  );
}
