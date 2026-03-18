import { getPrototypeWindow } from "@/features/hq/lib/prototype-window";

export function PrototypeChatPanel() {
  return (
    <>
      <div
        className="chat-overlay"
        id="chatOverlay"
        onClick={() => getPrototypeWindow().toggleChat?.()}
      />
      <div className="chat-panel" id="chatPanel">
        <div className="chat-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "18px", color: "var(--hq)" }}>✦</span>
            <div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "var(--text)"
                }}
              >
                Gravii Insight
              </div>
              <div style={{ fontSize: "12px", color: "var(--textM)" }}>
                AI-powered analysis assistant
              </div>
            </div>
          </div>
          <button className="chat-close" onClick={() => getPrototypeWindow().toggleChat?.()}>
            ✕
          </button>
        </div>
        <div className="chat-messages" id="chatMessages" />
        <div className="chat-input-wrap">
          <input
            type="text"
            className="chat-input"
            id="chatInput"
            placeholder="Ask about your data..."
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                getPrototypeWindow().sendChat?.();
              }
            }}
          />
          <button className="chat-send" onClick={() => getPrototypeWindow().sendChat?.()}>
            →
          </button>
        </div>
        <div className="chat-suggestions" id="chatSuggestions" />
      </div>
    </>
  );
}
