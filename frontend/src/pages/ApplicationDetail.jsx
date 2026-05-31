// ApplicationDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { applicationsService } from "../services/applicationsService";
import { Loader, StatusBadge, AIScoreBar } from "../components/ui/index";
import { formatDate } from "../utils/helpers";
import { ArrowLeft, Bot } from "lucide-react";
import toast from "react-hot-toast";

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [screening, setScreening] = useState(false);

  useEffect(() => {
    applicationsService.getOne(id).then(r => setApp(r.data?.data || r.data)).finally(() => setLoading(false));
  }, [id]);

  const handleAIScreen = async () => {
    setScreening(true);
    try {
      const res = await applicationsService.aiScreen(id);
      toast.success("AI screening complete!");
      setApp(p => ({ ...p, ...res.data?.data }));
    } catch { toast.error("Failed"); }
    setScreening(false);
  };

  if (loading) return <Loader />;
  if (!app) return <div style={{ color: "var(--red)" }}>Not found</div>;

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}><ArrowLeft size={14}/> Back</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--accent)" }}>{app.application_id}</span>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, marginTop: 6 }}>
                  {app.candidate_detail?.full_name} → {app.requisition_detail?.title}
                </h2>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Applied {formatDate(app.applied_date)}</p>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <StatusBadge status={app.status} />
                <button className="btn btn-secondary btn-sm" onClick={handleAIScreen} disabled={screening}
                  style={{ color: "var(--accent)", borderColor: "rgba(0,212,255,0.3)" }}>
                  {screening ? <span className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }} /> : <Bot size={14}/>}
                  {screening ? " Screening…" : " Run AI Screen"}
                </button>
              </div>
            </div>
          </div>

          {app.ai_match_score && (
            <div className="card" style={{ marginBottom: 16, background: "var(--accent-glass)", border: "1px solid rgba(196,98,45,0.12)" }}>
              <h4 style={{ fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <Bot size={16} style={{ color: "var(--accent)" }}/> AI Screening Result
              </h4>
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>Match Score</p>
                <AIScoreBar score={app.ai_match_score} />
              </div>
              {app.is_auto_shortlisted && (
                <div style={{ padding: "8px 12px", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 8, marginBottom: 12 }}>
                  <span style={{ color: "var(--green)", fontSize: 13, fontWeight: 600 }}>✓ Auto-shortlisted by AI</span>
                </div>
              )}
              {app.ai_screening_notes && (
                <p style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.6 }}>{app.ai_screening_notes}</p>
              )}
              {app.ai_screened_at && <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>Screened at {formatDate(app.ai_screened_at)}</p>}
            </div>
          )}

          {app.cover_letter && (
            <div className="card">
              <h4 style={{ fontWeight: 700, marginBottom: 12, fontSize: 13, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Cover Letter</h4>
              <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.7 }}>{app.cover_letter}</p>
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <h4 style={{ fontWeight: 700, marginBottom: 12, fontSize: 13, color: "var(--text-muted)", textTransform: "uppercase" }}>Candidate</h4>
            <Link to={`/candidates/${app.candidate_detail?.id}`} style={{ textDecoration: "none" }}>
              <div style={{ padding: "10px", background: "var(--bg-elevated)", borderRadius: "var(--radius)", border: "1px solid var(--border-soft)" }}>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{app.candidate_detail?.full_name}</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>{app.candidate_detail?.current_title}</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{app.candidate_detail?.total_experience} yrs exp</p>
              </div>
            </Link>
          </div>
          <div className="card">
            <h4 style={{ fontWeight: 700, marginBottom: 12, fontSize: 13, color: "var(--text-muted)", textTransform: "uppercase" }}>Position</h4>
            <Link to={`/jobs/${app.requisition_detail?.id}`} style={{ textDecoration: "none" }}>
              <div style={{ padding: "10px", background: "var(--bg-elevated)", borderRadius: "var(--radius)", border: "1px solid var(--border-soft)" }}>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{app.requisition_detail?.title}</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>{app.requisition_detail?.department_detail?.name}</p>
              </div>
            </Link>
          </div>
          {app.reviewer_notes && (
            <div className="card">
              <h4 style={{ fontWeight: 700, marginBottom: 8, fontSize: 13, color: "var(--text-muted)", textTransform: "uppercase" }}>Reviewer Notes</h4>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{app.reviewer_notes}</p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>by {app.reviewed_by_name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
