export function PrototypeMainHeader() {
  return (
    <div className="main-header">
      <div className="main-title" id="pageTitle">
        Overview
      </div>
      <div className="main-meta">
        <div className="period-sel">
          <button className="period-btn" data-period="24h">
            24h
          </button>
          <button className="period-btn active" data-period="7d">
            7d
          </button>
          <button className="period-btn" data-period="30d">
            30d
          </button>
          <button className="period-btn" data-period="90d">
            90d
          </button>
          <button className="period-btn" data-period="all">
            All
          </button>
        </div>
        <div className="main-status">Live</div>
        <div className="main-time" id="liveTime" />
      </div>
    </div>
  );
}
