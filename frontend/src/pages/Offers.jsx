import { useEffect, useState } from "react";
import api from "../services/api";
import { Loader, StatusBadge, EmptyState } from "../components/ui/index";
import { formatDate, formatSalary } from "../utils/helpers";
import { RefreshCw, Calendar } from "lucide-react";

export default function Offers() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/transactions/offers/?page_size=20")
      .then(r => {
        const d = r.data?.data;
        setItems(d?.results ?? (Array.isArray(d) ? d : []));
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Offers</div>
          <div className="page-subtitle">Job offers extended to shortlisted candidates</div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={load}><RefreshCw size={14} /></button>
      </div>

      {loading ? <Loader /> : items.length === 0 ? (
        <EmptyState title="No offers found" subtitle="Offers appear here once extended to candidates" />
      ) : (
        <>
          {/* ── Desktop table ───────────────────────────── */}
          <div className="table-wrap offers-table-desktop">
            <table>
              <thead>
                <tr>
                  <th>Candidate</th><th>Position</th><th>Offered Salary</th>
                  <th>Offer Date</th><th>Expiry</th><th>Joining</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map(o => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 600 }}>{o.candidate_name || "—"}</td>
                    <td style={{ color: "var(--text-secondary)", fontSize: 12.5 }}>{o.requisition_title || "—"}</td>
                    <td style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--green)" }}>
                      {formatSalary(o.offered_salary)}
                    </td>
                    <td style={{ fontSize: 12.5 }}>{formatDate(o.offer_date)}</td>
                    <td style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{formatDate(o.expiry_date)}</td>
                    <td style={{ fontSize: 12.5 }}>{formatDate(o.joining_date)}</td>
                    <td><StatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Mobile cards ────────────────────────────── */}
          <div className="offers-cards-mobile">
            {items.map(o => (
              <div key={o.id} className="card card-sm" style={{ marginBottom: 10 }}>

                {/* Candidate + status */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>
                    {o.candidate_name || "—"}
                  </p>
                  <StatusBadge status={o.status} />
                </div>

                {/* Position */}
                <p style={{ fontSize: 12.5, color: "var(--text-secondary)", marginBottom: 10 }}>
                  {o.requisition_title || "—"}
                </p>

                {/* Salary — prominent */}
                <div style={{
                  padding: "8px 12px", marginBottom: 10,
                  background: "var(--green-bg)",
                  border: "1px solid rgba(45,122,79,0.2)",
                  borderRadius: "var(--radius)",
                  display: "inline-block",
                }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--green)" }}>
                    {formatSalary(o.offered_salary)}
                  </span>
                </div>

                {/* Dates */}
                <div style={{
                  display: "flex", flexWrap: "wrap", gap: 12,
                  paddingTop: 10, borderTop: "1px solid var(--border-soft)",
                  fontSize: 12,
                }}>
                  {o.offer_date && (
                    <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                      <Calendar size={11} /> Offered: <strong style={{ color: "var(--text-secondary)" }}>{formatDate(o.offer_date)}</strong>
                    </span>
                  )}
                  {o.expiry_date && (
                    <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                      <Calendar size={11} /> Expires: <strong style={{ color: "var(--text-secondary)" }}>{formatDate(o.expiry_date)}</strong>
                    </span>
                  )}
                  {o.joining_date && (
                    <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                      <Calendar size={11} /> Joining: <strong style={{ color: "var(--text-secondary)" }}>{formatDate(o.joining_date)}</strong>
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
