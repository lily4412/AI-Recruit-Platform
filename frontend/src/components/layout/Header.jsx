import { Bell, Search, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const BREADCRUMBS = {
  "/":             ["Home", "Dashboard"],
  "/jobs":         ["Recruitment", "Job Openings"],
  "/candidates":   ["Recruitment", "Candidates"],
  "/applications": ["Recruitment", "Applications"],
  "/interviews":   ["Pipeline", "Interviews"],
  "/offers":       ["Pipeline", "Offers"],
  "/ai-tools":     ["Intelligence", "AI Tools"],
  "/analytics":    ["Intelligence", "Analytics"],
};

export default function Header({ onMenuClick }) {
  const location = useLocation();
  const [section, title] = BREADCRUMBS[location.pathname] || ["", "AI Recruitment"];
  const user = useSelector((s) => s.auth.user);

  return (
    <header style={{
      position: "fixed", top: 0, right: 0,
      left: "var(--sidebar-w)",   // desktop: offset by sidebar
      height: "var(--header-h)",
      background: "rgba(250,248,243,0.92)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border-soft)",
      zIndex: 90,
      display: "flex", alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
    }}
      className="app-header"
    >
      {/* ── Left: hamburger (mobile) + breadcrumb ────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Hamburger — hidden on desktop via CSS */}
        <button
          onClick={onMenuClick}
          className="hamburger-btn"
          style={{
            display: "none", // shown on mobile via CSS
            width: 36, height: 36, borderRadius: 8,
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "var(--text-secondary)",
            flexShrink: 0,
          }}
        >
          <Menu size={17} />
        </button>

        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          {section && (
            <>
              <span style={{ fontSize: 12.5, color: "var(--text-muted)", fontWeight: 500, letterSpacing: "0.2px" }}
                className="breadcrumb-section">
                {section}
              </span>
              <span style={{ color: "var(--border)", fontSize: 12 }} className="breadcrumb-section">/</span>
            </>
          )}
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: 16.5, fontWeight: 700,
            color: "var(--text-primary)", letterSpacing: "-0.2px",
          }}>
            {title}
          </h1>
        </div>
      </div>

      {/* ── Right controls ───────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Search hint — hidden on small mobile */}
        <div
          className="search-hint"
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "7px 14px", borderRadius: 8,
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            color: "var(--text-muted)", fontSize: 13,
            cursor: "pointer",
          }}>
          <Search size={14} />
          <span style={{ fontSize: 12.5 }}>Quick search…</span>
          <kbd style={{
            padding: "1px 5px", borderRadius: 4,
            background: "var(--bg-card)", border: "1px solid var(--border)",
            fontSize: 10.5, color: "var(--text-muted)", fontFamily: "var(--font-mono)",
          }}>⌘K</kbd>
        </div>

        {/* Bell */}
        <button style={{
          width: 36, height: 36, borderRadius: 8,
          background: "var(--bg-elevated)", border: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", position: "relative", transition: "all 0.15s",
          color: "var(--text-secondary)",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
        >
          <Bell size={15} />
          <span style={{
            position: "absolute", top: 7, right: 7,
            width: 6, height: 6, borderRadius: "50%",
            background: "var(--accent)", border: "1.5px solid var(--bg-base)",
          }} />
        </button>

        {/* User chip */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "5px 12px 5px 6px",
          background: "var(--bg-elevated)", border: "1px solid var(--border)",
          borderRadius: 20, cursor: "pointer", transition: "all 0.15s",
        }}>
          <div style={{
            width: 26, height: 26, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--accent) 0%, #e89052 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, color: "#fff",
          }}>
            {(user?.first_name?.[0] || user?.username?.[0] || "U").toUpperCase()}
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}
            className="user-name">
            {user?.first_name || user?.username || "User"}
          </span>
        </div>
      </div>
    </header>
  );
}
