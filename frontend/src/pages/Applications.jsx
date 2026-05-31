import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { fetchApplications } from "../store/slices/applicationsSlice";
import { applicationsService } from "../services/applicationsService";
import { Loader, StatusBadge, Pagination, EmptyState, AIScoreBar } from "../components/ui/index";
import { formatDate, debounce } from "../utils/helpers";
import { Search, RefreshCw, Eye, Bot } from "lucide-react";
import toast from "react-hot-toast";

export default function Applications() {
  const dispatch = useDispatch();
  const { items, total, loading } = useSelector((s) => s.applications);
  const [searchParams] = useSearchParams();
  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatus] = useState("");
  const [screening, setScreening] = useState(null);

  const load = useCallback(() => {
    dispatch(fetchApplications({
      page, search,
      status:      statusFilter || undefined,
      requisition: searchParams.get("requisition") || undefined,
      candidate:   searchParams.get("candidate")   || undefined,
    }));
  }, [page, search, statusFilter, searchParams]);

  useEffect(() => { load(); }, [load]);
  const debouncedSearch = useCallback(debounce((v) => { setSearch(v); setPage(1); }), []);

  const handleAIScreen = async (id) => {
    setScreening(id);
    try {
      const res = await applicationsService.aiScreen(id);
      const d = res.data?.data;
      toast.success(`AI Score: ${d?.ai_match_score}% — ${d?.auto_shortlisted ? "✓ Auto-shortlisted!" : "Not shortlisted"}`);
      load();
    } catch { toast.error("AI screening failed"); }
    setScreening(null);
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await applicationsService.updateStatus(id, { status });
      toast.success("Status updated");
      load();
    } catch { toast.error("Failed to update status"); }
  };

  const STATUS_OPTIONS = ["shortlisted","interview_scheduled","interviewed","offer_extended","hired","rejected"];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Applications</div>
          <div className="page-subtitle">{total} total applications in pipeline</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary btn-sm" onClick={load}><RefreshCw size={14} /></button>
        </div>
      </div>

      <div className="toolbar">
        <div className="search-wrap">
          <Search size={14} className="search-icon" />
          <input placeholder="Search by candidate name, app ID…" className="form-control"
            onChange={(e) => debouncedSearch(e.target.value)} />
        </div>
        <select className="form-control" style={{ width: 200 }}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All Statuses</option>
          {["applied","ai_screening","shortlisted","interview_scheduled","interviewed",
            "offer_extended","hired","rejected","withdrawn"].map(s => (
            <option key={s} value={s}>{s.replace(/_/g," ").replace(/\b\w/g, c => c.toUpperCase())}</option>
          ))}
        </select>
      </div>

      {loading ? <Loader /> : items.length === 0 ? (
        <EmptyState title="No applications found" />
      ) : (
        <>
          {/* ── Desktop table ───────────────────────────── */}
          <div className="table-wrap applications-table-desktop">
            <table>
              <thead>
                <tr>
                  <th>App ID</th><th>Candidate</th><th>Position</th>
                  <th>AI Score</th><th>Auto-SL</th><th>Status</th>
                  <th>Applied</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <span style={{ fontFamily: "monospace", fontSize: 11, color: "var(--accent)" }}>
                        {app.application_id}
                      </span>
                    </td>
                    <td>
                      <Link to={`/candidates/${app.candidate_detail?.id || app.candidate}`}
                        style={{ fontWeight: 600, color: "var(--text-primary)", textDecoration: "none" }}>
                        {app.candidate_detail?.full_name || "—"}
                      </Link>
                      <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                        {app.candidate_detail?.current_title}
                      </div>
                    </td>
                    <td>
                      <Link to={`/jobs/${app.requisition_detail?.id || app.requisition}`}
                        style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: 13 }}>
                        {app.requisition_detail?.title || "—"}
                      </Link>
                    </td>
                    <td style={{ minWidth: 160 }}><AIScoreBar score={app.ai_match_score} /></td>
                    <td style={{ textAlign: "center" }}>
                      {app.is_auto_shortlisted
                        ? <span style={{ color: "var(--green)", fontSize: 16 }}>✓</span>
                        : <span style={{ color: "var(--text-muted)" }}>—</span>}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <StatusBadge status={app.status} />
                        <select value="" onChange={(e) => e.target.value && handleUpdateStatus(app.id, e.target.value)}
                          className="form-control" style={{ fontSize: 11, padding: "3px 6px", width: 110, height: 26 }}>
                          <option value="">Change…</option>
                          {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s}>{s.replace(/_/g," ").replace(/\b\w/g, c => c.toUpperCase())}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{formatDate(app.applied_date)}</td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <Link to={`/applications/${app.id}`}>
                          <button className="btn btn-icon btn-ghost btn-sm"><Eye size={14} /></button>
                        </Link>
                        <button className="btn btn-icon btn-sm" onClick={() => handleAIScreen(app.id)}
                          disabled={screening === app.id} title="Run AI Screening"
                          style={{ background: "rgba(196,98,45,0.1)", color: "var(--accent)" }}>
                          {screening === app.id
                            ? <span className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }} />
                            : <Bot size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Mobile cards ────────────────────────────── */}
          <div className="applications-cards-mobile">
            {items.map((app) => (
              <div key={app.id} className="card card-sm" style={{ marginBottom: 10 }}>

                {/* Top row: app ID + auto-SL indicator */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontFamily: "monospace", fontSize: 11, color: "var(--accent)" }}>
                    {app.application_id}
                  </span>
                  {app.is_auto_shortlisted && (
                    <span style={{
                      fontSize: 11, fontWeight: 600, color: "var(--green)",
                      background: "var(--green-bg)", padding: "2px 8px",
                      borderRadius: 20, border: "1px solid rgba(45,122,79,0.2)",
                    }}>
                      ✓ Auto-shortlisted
                    </span>
                  )}
                </div>

                {/* Candidate name + role */}
                <Link to={`/candidates/${app.candidate_detail?.id || app.candidate}`} style={{ textDecoration: "none" }}>
                  <p style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", lineHeight: 1.3 }}>
                    {app.candidate_detail?.full_name || "—"}
                  </p>
                </Link>
                {app.candidate_detail?.current_title && (
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2, marginBottom: 6 }}>
                    {app.candidate_detail.current_title}
                  </p>
                )}

                {/* Position */}
                <Link to={`/jobs/${app.requisition_detail?.id || app.requisition}`} style={{ textDecoration: "none" }}>
                  <p style={{ fontSize: 12.5, color: "var(--text-secondary)", marginBottom: 10 }}>
                    📋 {app.requisition_detail?.title || "—"}
                  </p>
                </Link>

                {/* AI score bar */}
                {app.ai_match_score != null && (
                  <div style={{ marginBottom: 10 }}>
                    <AIScoreBar score={app.ai_match_score} />
                  </div>
                )}

                {/* Status + change select */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  flexWrap: "wrap", marginBottom: 10,
                }}>
                  <StatusBadge status={app.status} />
                  <select value="" onChange={(e) => e.target.value && handleUpdateStatus(app.id, e.target.value)}
                    className="form-control"
                    style={{ fontSize: 12, padding: "4px 8px", height: 30, flex: 1, minWidth: 120 }}>
                    <option value="">Change status…</option>
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{s.replace(/_/g," ").replace(/\b\w/g, c => c.toUpperCase())}</option>
                    ))}
                  </select>
                </div>

                {/* Footer: date + actions */}
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  paddingTop: 10, borderTop: "1px solid var(--border-soft)",
                }}>
                  <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                    Applied {formatDate(app.applied_date)}
                  </span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Link to={`/applications/${app.id}`}>
                      <button className="btn btn-secondary btn-sm"><Eye size={13} /> View</button>
                    </Link>
                    <button className="btn btn-sm" onClick={() => handleAIScreen(app.id)}
                      disabled={screening === app.id}
                      style={{ background: "rgba(196,98,45,0.1)", color: "var(--accent)", border: "1px solid rgba(196,98,45,0.25)" }}>
                      {screening === app.id
                        ? <span className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }} />
                        : <><Bot size={13} /> AI Screen</>}
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

          <Pagination page={page} total={total} onChange={setPage} />
        </>
      )}
    </div>
  );
}
