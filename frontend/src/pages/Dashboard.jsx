import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
} from "recharts";
import { dashboardService } from "../services/authService";
import { Briefcase, Users, FileText, Bot, CheckCircle, Clock, Award, TrendingUp } from "lucide-react";
import { Loader, StatusBadge, AIScoreBar, SectionHeader } from "../components/ui/index";
import { formatDate } from "../utils/helpers";

const C = ["#c4622d","#2d7a4f","#a06c10","#2563a8","#6d4c9e","#c0392b"];

const funnelData = [
  { stage: "Applied",     count: 248 },
  { stage: "AI Screened", count: 186 },
  { stage: "Shortlisted", count: 94 },
  { stage: "Interviewed", count: 52 },
  { stage: "Offered",     count: 21 },
  { stage: "Hired",       count: 14 },
];

const monthlyData = [
  { month: "Jan", applications: 32, hired: 4, ai_screened: 28 },
  { month: "Feb", applications: 45, hired: 6, ai_screened: 40 },
  { month: "Mar", applications: 38, hired: 5, ai_screened: 33 },
  { month: "Apr", applications: 60, hired: 8, ai_screened: 55 },
  { month: "May", applications: 52, hired: 7, ai_screened: 47 },
  { month: "Jun", applications: 75, hired: 10, ai_screened: 68 },
];

const toolUsage = [
  { name: "ATS Screening", value: 42 },
  { name: "AI Chatbot",    value: 24 },
  { name: "Video AI",      value: 18 },
  { name: "Predictive",    value: 16 },
];

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff", border: "1px solid var(--border)",
      borderRadius: 8, padding: "10px 14px", fontSize: 12,
      boxShadow: "var(--shadow)", fontFamily: "var(--font-body)",
    }}>
      {label && <p style={{ color: "var(--text-muted)", marginBottom: 5, fontWeight: 600 }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontWeight: 500 }}>{p.name}: <b>{p.value}</b></p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useSelector((s) => s.auth.user);

  useEffect(() => {
    dashboardService.getStats()
      .then((r) => setStats(r.data?.data))
      .catch(() => setStats({}))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const cards = [
    { label: "Open Jobs",        value: stats?.open_jobs ?? 0,            icon: Briefcase,   color: "var(--accent)",  bg: "rgba(196,98,45,0.1)"  },
    { label: "Total Candidates", value: stats?.total_candidates ?? 0,     icon: Users,       color: "var(--green)",   bg: "var(--green-bg)"       },
    { label: "Applications",     value: stats?.total_applications ?? 0,   icon: FileText,    color: "var(--blue)",    bg: "var(--blue-bg)"        },
    { label: "AI Tools Active",  value: stats?.ai_tools_active ?? 7,      icon: Bot,         color: "var(--purple)",  bg: "var(--purple-bg)"      },
    { label: "Shortlisted",      value: stats?.shortlisted ?? 0,          icon: CheckCircle, color: "var(--green)",   bg: "var(--green-bg)"       },
    { label: "Interviews Sched", value: stats?.interviews_scheduled ?? 0, icon: Clock,       color: "var(--yellow)",  bg: "var(--yellow-bg)"      },
    { label: "Offers Extended",  value: stats?.offers_extended ?? 0,      icon: Award,       color: "var(--accent)",  bg: "rgba(196,98,45,0.1)"  },
    { label: "Offers Accepted",  value: stats?.offers_accepted ?? 0,      icon: TrendingUp,  color: "var(--green)",   bg: "var(--green-bg)"       },
  ];

  return (
    <div>
      {/* Welcome header */}
      <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid var(--border-soft)" }}>
        <h2 style={{
          fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700,
          color: "var(--text-primary)", letterSpacing: "-0.3px",
        }}>
          Good day, {user?.first_name || user?.username} 👋
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: 13.5, marginTop: 5 }}>
          Here's what's happening in your AI recruitment pipeline today.
        </p>
      </div>

      {/* Stats Grid — 4 cols → 2 cols → 2 cols (via CSS class) */}
      <div className="dashboard-stats-grid">
        {cards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="stat-card">
            <div className="stat-icon" style={{ background: bg }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div className="stat-value" style={{ color }}>{value}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 — side by side → stacked */}
      <div className="dashboard-chart-row" style={{ marginBottom: 18 }}>
        <div className="card">
          <SectionHeader title="Monthly Recruitment Trend" subtitle="Applications · AI Screened · Hired" />
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" />
              <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11, fontFamily: "var(--font-body)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<Tip />} />
              <Legend wrapperStyle={{ fontSize: 12, fontFamily: "var(--font-body)", color: "var(--text-secondary)" }} />
              <Line type="monotone" dataKey="applications" stroke="#c4622d" strokeWidth={2.5} dot={{ fill: "#c4622d", r: 4 }} name="Applications" />
              <Line type="monotone" dataKey="ai_screened"  stroke="#6d4c9e" strokeWidth={2} dot={false} strokeDasharray="5 3" name="AI Screened" />
              <Line type="monotone" dataKey="hired"        stroke="#2d7a4f" strokeWidth={2.5} dot={{ fill: "#2d7a4f", r: 4 }} name="Hired" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <SectionHeader title="AI Tool Usage Share" />
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={toolUsage} cx="50%" cy="50%" innerRadius={50} outerRadius={76}
                   dataKey="value" paddingAngle={4}>
                {toolUsage.map((_, i) => <Cell key={i} fill={C[i % C.length]} />)}
              </Pie>
              <Tooltip content={<Tip />} />
              <Legend wrapperStyle={{ fontSize: 12, fontFamily: "var(--font-body)", color: "var(--text-secondary)" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="dashboard-chart-row" style={{ marginBottom: 18 }}>
        <div className="card">
          <SectionHeader title="Recruitment Funnel" subtitle="Full pipeline overview" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={funnelData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="stage" type="category" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} axisLine={false} tickLine={false} width={82} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="count" radius={[0,6,6,0]} name="Candidates">
                {funnelData.map((_, i) => <Cell key={i} fill={C[i % C.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Applications */}
        <div className="card">
          <SectionHeader
            title="Recent Applications"
            action={<Link to="/applications" style={{ fontSize: 12, color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>View all →</Link>}
          />
          {(stats?.recent_applications || []).length === 0 ? (
            <div style={{ textAlign: "center", padding: "28px 0", color: "var(--text-muted)", fontSize: 13 }}>
              No recent applications yet.{" "}
              <Link to="/applications" style={{ color: "var(--accent)" }}>Explore pipeline →</Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(stats.recent_applications || []).slice(0, 5).map((app) => (
                <Link key={app.id} to={`/applications/${app.id}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 12px", background: "var(--bg-surface)",
                    borderRadius: "var(--radius)", border: "1px solid var(--border-soft)",
                    transition: "all 0.14s",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "var(--bg-hover)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-soft)"; e.currentTarget.style.background = "var(--bg-surface)"; }}
                  >
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                        {app.candidate_detail?.full_name || "Candidate"}
                      </p>
                      <p style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>
                        {app.requisition_detail?.title} · {formatDate(app.applied_date)}
                      </p>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Impact Banner */}
      <div className="card" style={{
        background: "linear-gradient(135deg, #faf3ec 0%, #f5f0e8 100%)",
        border: "1px solid rgba(196,98,45,0.2)",
        borderLeft: "4px solid var(--accent)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <Bot size={18} style={{ color: "var(--accent)" }} />
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>
            AI Platform Impact
          </h3>
          <span className="badge badge-orange" style={{ fontSize: 10 }}>Live Stats</span>
        </div>
        <div className="dashboard-impact-grid">
          {[
            ["78.4%",   "Avg AI Match Score",  "across screened apps"],
            ["63%",     "Auto-Shortlisted",    "of AI-screened candidates"],
            ["< 4 hrs", "Time-to-Shortlist",   "vs 3 weeks manually"],
            ["92.5%",   "Screening Accuracy",  "ResumeAI Pro benchmark"],
          ].map(([v, l, s]) => (
            <div key={l} style={{
              textAlign: "center", padding: "14px 10px",
              background: "#fff", borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
            }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--accent)" }}>{v}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", marginTop: 6 }}>{l}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>{s}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
