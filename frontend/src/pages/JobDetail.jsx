import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { jobsService } from "../services/jobsService";
import { Loader, StatusBadge, AIScoreBar } from "../components/ui/index";
import { formatDate, formatSalary } from "../utils/helpers";
import { ArrowLeft, MapPin, Clock, Users, Bot, Send } from "lucide-react";
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
    try { await jobsService.publish(id); toast.success("Published!"); setJob(p => ({...p, status: "open"})); }
    catch { toast.error("Failed"); }
  };

  if (loading) return <Loader />;
  if (!job) return <div style={{ color: "var(--red)" }}>Job not found</div>;

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}><ArrowLeft size={14}/> Back</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--accent)", marginBottom: 6, display: "block" }}>{job.job_id}</span>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700 }}>{job.title}</h2>
                <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
                  {job.department_detail?.name && <span style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}><Users size={13}/>{job.department_detail.name}</span>}
                  {job.location_detail?.city  && <span style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}><MapPin size={13}/>{job.location_detail.city}</span>}
                  {job.employment_type_detail?.name && <span style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}><Clock size={13}/>{job.employment_type_detail.name}</span>}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <StatusBadge status={job.status} />
                {job.status === "draft" && <button className="btn btn-primary btn-sm" onClick={handlePublish}><Send size={13}/> Publish</button>}
              </div>
            </div>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: 14 }}>{job.description}</p>
          </div>

          <div className="card">
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: 16 }}>Applications ({apps.length})</h3>
            {apps.length === 0 ? <p style={{ color: "var(--text-muted)" }}>No applications yet.</p> : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {apps.map((app) => (
                  <Link key={app.id} to={`/applications/${app.id}`} style={{ textDecoration: "none" }}>
                    <div style={{ padding: "12px 14px", background: "var(--bg-elevated)", borderRadius: "var(--radius)", border: "1px solid var(--border-soft)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 14 }}>{app.candidate_detail?.full_name}</p>
                        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{app.candidate_detail?.current_title} · {app.candidate_detail?.total_experience} yrs</p>
                      </div>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <div style={{ width: 140 }}><AIScoreBar score={app.ai_match_score} /></div>
                        <StatusBadge status={app.status} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <h4 style={{ fontWeight: 700, marginBottom: 12, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)" }}>Job Details</h4>
            {[
              ["Level", job.level_detail?.name],
              ["Vacancies", job.vacancies],
              ["Experience", `${job.min_experience}–${job.max_experience} years`],
              ["Salary", job.min_salary ? `${formatSalary(job.min_salary)} – ${formatSalary(job.max_salary)}` : "Not disclosed"],
              ["AI Threshold", `${job.ai_score_threshold}%`],
              ["Posted", formatDate(job.created_at)],
              ["Target Date", formatDate(job.target_date)],
            ].map(([k, v]) => v && (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-soft)" }}>
                <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{k}</span>
                <span style={{ fontSize: 12.5, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
          {job.skills_detail?.length > 0 && (
            <div className="card">
              <h4 style={{ fontWeight: 700, marginBottom: 12, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)" }}>Required Skills</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {job.skills_detail.map(s => <span key={s.id} className="badge badge-blue">{s.name}</span>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
