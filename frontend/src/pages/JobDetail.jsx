import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { jobsService } from "../services/jobsService";
import { Loader, StatusBadge, AIScoreBar } from "../components/ui/index";
import { formatDate, formatSalary } from "../utils/helpers";
import { ArrowLeft, MapPin, Clock, Users, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function JobDetail() {
  const { id }          = useParams();
  const navigate        = useNavigate();
  const [job, setJob]   = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([jobsService.getOne(id), jobsService.getApplications(id)])
      .then(([jr, ar]) => {
        setJob(jr.data?.data || jr.data);
        const d = ar.data?.data;
        setApps(Array.isArray(d) ? d : d?.results || []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handlePublish = async () => {
    try {
      await jobsService.publish(id);
      toast.success("Published!");
      setJob(p => ({ ...p, status: "open" }));
    } catch {
      toast.error("Failed");
    }
  };

  if (loading) return <Loader />;
  if (!job) return <div style={{ color: "var(--red)" }}>Job not found</div>;

  return (
    <div>
      {/* Back button */}
      <div style={{ marginBottom: 16 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      {/* Two-col on desktop, single-col on mobile */}
      <div className="jobdetail-layout">

        {/* ── Left / Main column ───────────────────────── */}
        <div>
          {/* Job header card */}
          <div className="card" style={{ marginBottom: 16 }}>
            {/* Title row — stacks on mobile */}
            <div className="jobdetail-header">
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--accent)", marginBottom: 6, display: "block" }}>
                  {job.job_id}
                </span>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, lineHeight: 1.3 }}>
                  {job.title}
                </h2>
                <div style={{ display: "flex", gap: 14, marginTop: 8, flexWrap: "wrap" }}>
                  {job.department_detail?.name && (
                    <span style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                      <Users size={13} />{job.department_detail.name}
                    </span>
                  )}
                  {job.location_detail?.city && (
                    <span style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                      <MapPin size={13} />{job.location_detail.city}
                    </span>
                  )}
                  {job.employment_type_detail?.name && (
                    <span style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={13} />{job.employment_type_detail.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Status + publish — moves below title on mobile */}
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0, flexWrap: "wrap" }}>
                <StatusBadge status={job.status} />
                {job.status === "draft" && (
                  <button className="btn btn-primary btn-sm" onClick={handlePublish}>
                    <Send size={13} /> Publish
                  </button>
                )}
              </div>
            </div>

            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: 14, marginTop: 16 }}>
              {job.description}
            </p>
          </div>

          {/* Applications list */}
          <div className="card">
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: 16 }}>
              Applications ({apps.length})
            </h3>
            {apps.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>No applications yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {apps.map((app) => (
                  <Link key={app.id} to={`/applications/${app.id}`} style={{ textDecoration: "none" }}>
                    <div
                      className="jobdetail-app-row"
                      style={{
                        padding: "12px 14px",
                        background: "var(--bg-elevated)",
                        borderRadius: "var(--radius)",
                        border: "1px solid var(--border-soft)",
                        transition: "all 0.14s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "var(--bg-hover)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-soft)"; e.currentTarget.style.background = "var(--bg-elevated)"; }}
                    >
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 14 }}>{app.candidate_detail?.full_name}</p>
                        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                          {app.candidate_detail?.current_title} · {app.candidate_detail?.total_experience} yrs
                        </p>
                      </div>
                      <div className="jobdetail-app-meta">
                        <div style={{ width: 130 }}><AIScoreBar score={app.ai_match_score} /></div>
                        <StatusBadge status={app.status} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right / Sidebar column ───────────────────── */}
        <div>
          {/* Job details */}
          <div className="card" style={{ marginBottom: 16 }}>
            <h4 style={{ fontWeight: 700, marginBottom: 12, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)" }}>
              Job Details
            </h4>
            {[
              ["Level",      job.level_detail?.name],
              ["Vacancies",  job.vacancies],
              ["Experience", `${job.min_experience}–${job.max_experience} years`],
              ["Salary",     job.min_salary ? `${formatSalary(job.min_salary)} – ${formatSalary(job.max_salary)}` : "Not disclosed"],
              ["AI Threshold", `${job.ai_score_threshold}%`],
              ["Posted",     formatDate(job.created_at)],
              ["Target Date",formatDate(job.target_date)],
            ].map(([k, v]) => v && (
              <div key={k} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 0", borderBottom: "1px solid var(--border-soft)", gap: 12,
              }}>
                <span style={{ fontSize: 12.5, color: "var(--text-muted)", flexShrink: 0 }}>{k}</span>
                <span style={{ fontSize: 12.5, fontWeight: 600, textAlign: "right" }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Required skills */}
          {job.skills_detail?.length > 0 && (
            <div className="card">
              <h4 style={{ fontWeight: 700, marginBottom: 12, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)" }}>
                Required Skills
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {job.skills_detail.map(s => (
                  <span key={s.id} className="badge badge-blue">{s.name}</span>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
