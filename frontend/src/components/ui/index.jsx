import { X, SearchX } from "lucide-react";
import { getStatusBadge, getAIScoreColor } from "../../utils/helpers";

// ── Loader ──────────────────────────────────────────────────
export function Loader({ size = 34 }) {
  return (
    <div className="loader-wrap">
      <div className="spinner" style={{ width: size, height: size }} />
    </div>
  );
}

// ── Modal ────────────────────────────────────────────────────
export function Modal({ title, children, onClose, footer, wide }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: wide ? 820 : 640 }}>
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="btn btn-icon btn-ghost" onClick={onClose} style={{ borderRadius: "50%" }}>
            <X size={17} />
          </button>
        </div>
        {children}
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

// ── StatusBadge ──────────────────────────────────────────────
export function StatusBadge({ status, label }) {
  const text = (label || status || "").replace(/_/g, " ");
  const display = text.charAt(0).toUpperCase() + text.slice(1);
  return <span className={`badge ${getStatusBadge(status)}`}>{display}</span>;
}

// ── AI Score Bar ─────────────────────────────────────────────
export function AIScoreBar({ score }) {
  if (!score) return <span style={{ color: "var(--text-muted)", fontSize: 12 }}>—</span>;
  const color = getAIScoreColor(score);
  return (
    <div className="ai-score-bar">
      <div className="ai-score-track">
        <div className="ai-score-fill" style={{ width: `${score}%`, background: color }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color, minWidth: 38, fontFamily: "var(--font-mono)" }}>
        {score}%
      </span>
    </div>
  );
}

// ── Pagination ───────────────────────────────────────────────
export function Pagination({ page, total, pageSize = 10, onChange }) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1);
  return (
    <div className="pagination">
      <button onClick={() => onChange(page - 1)} disabled={page === 1}>‹</button>
      {pages.map((p) => (
        <button key={p} className={page === p ? "active" : ""} onClick={() => onChange(p)}>
          {p}
        </button>
      ))}
      {totalPages > 7 && (
        <span style={{ color: "var(--text-muted)", fontSize: 13 }}>… {totalPages}</span>
      )}
      <button onClick={() => onChange(page + 1)} disabled={page === totalPages}>›</button>
    </div>
  );
}

// ── Empty State ──────────────────────────────────────────────
export function EmptyState({ title = "No records found", subtitle = "" }) {
  return (
    <div className="empty-state">
      <SearchX size={44} style={{ color: "var(--text-muted)" }} />
      <h3>{title}</h3>
      {subtitle && <p style={{ fontSize: 13, marginTop: 4 }}>{subtitle}</p>}
    </div>
  );
}

// ── Section Header ───────────────────────────────────────────
export function SectionHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
      <div>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }}>
          {title}
        </h3>
        {subtitle && <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
