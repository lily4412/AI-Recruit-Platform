import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { candidatesService } from "../services/candidatesService";
import { Loader, AIScoreBar, StatusBadge } from "../components/ui/index";
import { formatDate } from "../utils/helpers";
import { ArrowLeft, Mail, Phone, Briefcase, Github, Linkedin, Cpu } from "lucide-react";
import toast from "react-hot-toast";

export default function CandidateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    candidatesService.getOne(id)
      .then(r => setCandidate(r.data?.data || r.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAIScore = async () => {
    try {
      const res = await candidatesService.aiScore(id);
      const score = res.data?.data?.ai_profile_score;
      toast.success(`AI Profile Score: ${score}%`);
      setCandidate(p => ({ ...p, ai_profile_score: score }));
    } catch { toast.error("AI scoring failed"); }
  };

  if (loading) return <Loader />;
  if (!candidate) return <div style={{ color: "var(--red)" }}>Candidate not found</div>;

  const c = candidate;

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      {/* Two-col desktop → single-col mobile */}
      <div className="candidatedetail-layout">

        {/* ── Main column ──────────────────────────────── */}
        <div>

          {/* Profile header card */}
          <div className="card" style={{ marginBottom: 16 }}>
            {/* Avatar + name row — stacks on very small screens */}
            <div className="candidatedetail-header">
              <div style={{ display: "flex", gap: 14, alignItems: "center", flex: 1, minWidth: 0 }}>
                <div style={{
                  width: 60, height: 60, flexShrink: 0,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,var(--accent),var(--purple))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "#fff",
                }}>
                  {c.first_name?.[0]}
                </div>
                <div style={{ minWidth: 0 }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700, lineHeight: 1.3 }}>
                    {c.full_name || `${c.first_name} ${c.last_name}`}
                  </h2>
                  <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 3 }}>
                    {c.current_title}{c.current_company ? ` at ${c.current_company}` : ""}
                  </p>
                  <p style={{ color: "var(--text-muted)", fontSize: 11.5, marginTop: 2 }}>
                    <span style={{ fontFamily: "monospace" }}>{c.candidate_id}</span> · Added {formatDate(c.created_at)}
                  </p>
                </div>
              </div>

              <button
                className="btn btn-secondary btn-sm"
                onClick={handleAIScore}
                style={{ color: "var(--accent)", borderColor: "rgba(196,98,45,0.3)", flexShrink: 0 }}
              >
                <Cpu size={14} /> Run AI Score
              </button>
            </div>

            {/* Contact info */}
            <div className="candidatedetail-contact">
              {[
                [Mail,     c.email],
                [Phone,    c.phone],
                [Briefcase,c.total_experience ? `${c.total_experience} years experience` : null],
              ].map(([Icon, val], i) => val && (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Icon size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{val}</span>
                </div>
              ))}
            </div>

            {/* AI score bar */}
            {c.ai_profile_score && (
              <div style={{
                marginTop: 16, padding: "12px 14px",
                background: "var(--accent-glass)",
                border: "1px solid rgba(196,98,45,0.2)",
                borderRadius: "var(--radius)",
              }}>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>AI Profile Strength</p>
                <AIScoreBar score={c.ai_profile_score} />
              </div>
            )}
          </div>

          {/* Skills */}
          {c.skills_detail?.length > 0 && (
            <div className="card" style={{ marginBottom: 16 }}>
              <h4 style={{ fontWeight: 700, marginBottom: 12, fontSize: 13, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Skills
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {c.skills_detail.map(s => (
                  <span key={s.id} className={`badge badge-${s.category === "ai_ml" ? "purple" : s.category === "cloud" ? "blue" : "gray"}`}>
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Applications */}
          {c.applications?.length > 0 && (
            <div className="card">
              <h4 style={{ fontWeight: 700, marginBottom: 12, fontSize: 13, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Applications ({c.application_count})
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {c.applications.map(app => (
                  <Link key={app.id} to={`/applications/${app.id}`} style={{ textDecoration: "none" }}>
                    <div style={{
                      padding: "10px 12px",
                      background: "var(--bg-elevated)",
                      borderRadius: "var(--radius)",
                      border: "1px solid var(--border-soft)",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      gap: 10, flexWrap: "wrap",
                      transition: "all 0.14s",
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-soft)"; }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{app.requisition_detail?.title}</span>
                      <StatusBadge status={app.status} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Sidebar column ───────────────────────────── */}
        <div className="card" style={{ alignSelf: "start" }}>
          <h4 style={{ fontWeight: 700, marginBottom: 14, fontSize: 13, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Profile Info
          </h4>
          {[
            ["Source",      c.source_display || c.source],
            ["Location",    c.current_location],
            ["Experience",  c.total_experience ? `${c.total_experience} years` : null],
            ["Applications",c.application_count ?? 0],
          ].map(([k, v]) => (v !== undefined && v !== null && v !== "") && (
            <div key={k} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "8px 0", borderBottom: "1px solid var(--border-soft)", gap: 12,
            }}>
              <span style={{ fontSize: 12.5, color: "var(--text-muted)", flexShrink: 0 }}>{k}</span>
              <span style={{ fontSize: 12.5, fontWeight: 600, textAlign: "right" }}>{v}</span>
            </div>
          ))}

          {(c.linkedin_url || c.github_url) && (
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              {c.linkedin_url && (
                <a href={c.linkedin_url} target="_blank" rel="noreferrer"
                  className="btn btn-secondary btn-sm" style={{ justifyContent: "center" }}>
                  <Linkedin size={13} /> LinkedIn
                </a>
              )}
              {c.github_url && (
                <a href={c.github_url} target="_blank" rel="noreferrer"
                  className="btn btn-secondary btn-sm" style={{ justifyContent: "center" }}>
                  <Github size={13} /> GitHub
                </a>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
