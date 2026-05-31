import { useEffect, useState } from "react";
import api from "../services/api";
import { Loader, StatusBadge, EmptyState } from "../components/ui/index";
import { formatDate } from "../utils/helpers";
import { RefreshCw, Calendar, Clock } from "lucide-react";

export default function Interviews() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/transactions/interviews/?page_size=20")
      .then(r => {
        const d = r.data?.data;
        setItems(d?.results ?? (Array.isArray(d) ? d : []));
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const fmtDate = (dt) => dt
    ? new Date(dt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
    : "—";

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Interviews</div>
          <div className="page-subtitle">Scheduled and completed interview sessions</div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={load}><RefreshCw size={14} /></button>
      </div>

      {loading ? <Loader /> : items.length === 0 ? (
        <EmptyState
          title="No interviews scheduled"
          subtitle="Interviews will appear here once applications are shortlisted"
        />
      ) : (
        <>
          {/* ── Desktop table ───────────────────────────── */}
          <div className="table-wrap interviews-table-desktop">
            <table>
              <thead>
                <tr>
                  <th>Candidate</th><th>Position</th><th>Type</th><th>Round</th>
                  <th>Scheduled</th><th>Duration</th><th>Status</th><th>Result</th><th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {items.map(iv => (
                  <tr key={iv.id}>
                    <td style={{ fontWeight: 600 }}>{iv.candidate_name || "—"}</td>
                    <td style={{ color: "var(--text-secondary)", fontSize: 12.5 }}>{iv.requisition_title || "—"}</td>
                    <td><span className="badge badge-blue" style={{ fontSize: 11 }}>{iv.type_display}</span></td>
                    <td style={{ textAlign: "center" }}>#{iv.round_number}</td>
                    <td style={{ fontSize: 12.5 }}>{fmtDate(iv.scheduled_at)}</td>
                    <td style={{ textAlign: "center", color: "var(--text-muted)" }}>{iv.duration_mins} min</td>
                    <td><StatusBadge status={iv.status} /></td>
                    <td><StatusBadge status={iv.result} /></td>
                    <td style={{ textAlign: "center" }}>
                      {iv.rating
                        ? <span style={{ color: "#f59e0b", fontWeight: 700 }}>{"★".repeat(iv.rating)}{"☆".repeat(5 - iv.rating)}</span>
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Mobile cards ────────────────────────────── */}
          <div className="interviews-cards-mobile">
            {items.map(iv => (
              <div key={iv.id} className="card card-sm" style={{ marginBottom: 10 }}>

                {/* Top: type badge + round */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span className="badge badge-blue" style={{ fontSize: 11 }}>{iv.type_display}</span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>Round #{iv.round_number}</span>
                </div>

                {/* Candidate name */}
                <p style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 3 }}>
                  {iv.candidate_name || "—"}
                </p>

                {/* Position */}
                <p style={{ fontSize: 12.5, color: "var(--text-secondary)", marginBottom: 10 }}>
                  {iv.requisition_title || "—"}
                </p>

                {/* Schedule + duration */}
                <div style={{ display: "flex", gap: 16, marginBottom: 10, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                    <Calendar size={12} />{fmtDate(iv.scheduled_at)}
                  </span>
                  {iv.duration_mins && (
                    <span style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={12} />{iv.duration_mins} min
                    </span>
                  )}
                </div>

                {/* Status row */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  paddingTop: 10, borderTop: "1px solid var(--border-soft)",
                  flexWrap: "wrap", gap: 8,
                }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <StatusBadge status={iv.status} />
                    {iv.result && <StatusBadge status={iv.result} />}
                  </div>
                  {iv.rating && (
                    <span style={{ color: "#f59e0b", fontWeight: 700, fontSize: 14 }}>
                      {"★".repeat(iv.rating)}{"☆".repeat(5 - iv.rating)}
                    </span>
                  )}
                </div>

              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
