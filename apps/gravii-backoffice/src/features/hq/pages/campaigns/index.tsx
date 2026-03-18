import { getPrototypeWindow } from "@/features/hq/lib/prototype-window";

export function PrototypeCampaignsPage() {
  const handleFilterClick = (element: HTMLElement) => {
    getPrototypeWindow().togF?.(element);
  };

  return (
    <div className="page" id="page-campaigns">
      <div className="filter-bar fade-in">
        <div className="filter-bar-label">Filter</div>
        <div className="filter-group">
          <span className="fbtn f-active" onClick={(event) => handleFilterClick(event.currentTarget)}>
            All Status
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Live
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Ending
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Pending
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Completed
          </span>
        </div>
        <div className="filter-sep" />
        <div className="filter-group">
          <span className="fbtn f-active" onClick={(event) => handleFilterClick(event.currentTarget)}>
            All Scopes
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Users
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Gravii Pool
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Both
          </span>
        </div>
        <div className="filter-sep" />
        <div className="filter-group">
          <span className="fbtn f-active" onClick={(event) => handleFilterClick(event.currentTarget)}>
            All Partners
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            Nexus
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            ChainVault
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            ZenProtocol
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            DeFi Pulse
          </span>
          <span className="fbtn" onClick={(event) => handleFilterClick(event.currentTarget)}>
            MetaBridge
          </span>
        </div>
        <button
          className="fbtn-reset"
          onClick={(event) => getPrototypeWindow().resetF?.(event.currentTarget)}
        >
          Reset
        </button>
      </div>

      <div id="camp-stats" className="stat-grid fade-in fade-d1" />

      <div className="card fade-in fade-d2">
        <div className="sec-head">
          <div className="sec-title">Campaign List</div>
        </div>
        <div style={{ overflowX: "auto" }} id="camp-table" />
        <div
          style={{
            marginTop: "12px",
            fontSize: "12px",
            color: "var(--textD)",
            fontStyle: "italic"
          }}
          id="camp-footer"
        />
      </div>

      <div className="g2 fade-in fade-d3" style={{ marginTop: "20px" }}>
        <div className="card">
          <div className="sec-head">
            <div className="sec-title">Effectiveness by Scope</div>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th>Scope</th>
                <th>Campaigns</th>
                <th>Avg Engaged</th>
                <th>
                  Avg CPA{" "}
                  <span className="roi-tip" title="CPA = Cost ÷ Engaged (cost per user acquired)">
                    i
                  </span>
                </th>
                <th>Sybil Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600, color: "var(--blue)" }}>Users</td>
                <td className="tbl-mono">6</td>
                <td className="tbl-mono">1,840</td>
                <td className="tbl-mono">$0.32</td>
                <td>
                  <span className="tag tag-green">3.2%</span>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: "var(--teal)" }}>Both</td>
                <td className="tbl-mono">8</td>
                <td className="tbl-mono">2,640</td>
                <td className="tbl-mono">$0.42</td>
                <td>
                  <span className="tag tag-green">6.8%</span>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: "var(--purple)" }}>Gravii Pool</td>
                <td className="tbl-mono">4</td>
                <td className="tbl-mono">3,210</td>
                <td className="tbl-mono">$0.56</td>
                <td>
                  <span className="tag tag-amber">11.2%</span>
                </td>
              </tr>
            </tbody>
          </table>
          <div
            style={{
              marginTop: "12px",
              fontSize: "12px",
              color: "var(--textD)",
              fontStyle: "italic"
            }}
          >
            Users scope shows lowest CPA ($0.32/user). Gravii Pool has widest reach but higher
            sybil rate and cost.
          </div>
        </div>
        <div className="card">
          <div className="sec-head">
            <div className="sec-title">Effectiveness by Tier Targeting</div>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th>Target Tier</th>
                <th>Campaigns</th>
                <th>Avg Engagement</th>
                <th>
                  Avg CPA{" "}
                  <span className="roi-tip" title="CPA = Cost ÷ Engaged (cost per user acquired)">
                    i
                  </span>
                </th>
                <th>Retention After</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600, color: "var(--lav)" }}>Black</td>
                <td className="tbl-mono">3</td>
                <td className="tbl-mono">62%</td>
                <td className="tbl-mono">$0.24</td>
                <td className="tbl-mono">88%</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: "var(--amber)" }}>Platinum+</td>
                <td className="tbl-mono">6</td>
                <td className="tbl-mono">48%</td>
                <td className="tbl-mono">$0.31</td>
                <td className="tbl-mono">76%</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: "var(--cream)" }}>Gold+</td>
                <td className="tbl-mono">8</td>
                <td className="tbl-mono">36%</td>
                <td className="tbl-mono">$0.42</td>
                <td className="tbl-mono">68%</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: "var(--textM)" }}>Classic (all)</td>
                <td className="tbl-mono">4</td>
                <td className="tbl-mono">22%</td>
                <td className="tbl-mono">$0.83</td>
                <td className="tbl-mono">42%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
