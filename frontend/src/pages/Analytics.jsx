import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts";

const C  = ["#c4622d","#2d7a4f","#a06c10","#2563a8","#6d4c9e","#c0392b"];
const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", fontSize: 12, boxShadow: "var(--shadow)", fontFamily: "var(--font-body)" }}>
      {label && <p style={{ color: "var(--text-muted)", marginBottom: 5, fontWeight: 600 }}>{label}</p>}
      {payload.map((p, i) => <p key={i} style={{ color: p.color, fontWeight: 500 }}>{p.name}: <b>{p.value}</b></p>)}
    </div>
  );
};

const sourceData = [
  { source: "LinkedIn",  count: 52, hired: 8 },
  { source: "Job Portal",count: 48, hired: 6 },
  { source: "Referral",  count: 28, hired: 5 },
  { source: "Campus",    count: 35, hired: 4 },
  { source: "AI Sourced",count: 18, hired: 3 },
  { source: "Agency",    count: 15, hired: 2 },
];
const skillDemand = [
  { skill: "Python",     demand: 85 }, { skill: "React",      demand: 72 },
  { skill: "AWS",        demand: 68 }, { skill: "ML/AI",      demand: 65 },
  { skill: "Java",       demand: 58 }, { skill: "DevOps",     demand: 55 },
  { skill: "TypeScript", demand: 50 }, { skill: "Go",         demand: 38 },
];
const deptHiring = [
  { dept: "Engineering", target: 20, achieved: 14 },
  { dept: "Data Science",target: 10, achieved: 7  },
  { dept: "DevOps",      target: 8,  achieved: 5  },
  { dept: "QA",          target: 6,  achieved: 4  },
  { dept: "Product",     target: 5,  achieved: 3  },
];
const aiVsManual = [
  { month: "Jan", ai_time: 12, manual_time: 38 },
  { month: "Feb", ai_time: 11, manual_time: 40 },
  { month: "Mar", ai_time: 10, manual_time: 42 },
  { month: "Apr", ai_time: 9,  manual_time: 45 },
  { month: "May", ai_time: 8,  manual_time: 43 },
  { month: "Jun", ai_time: 7,  manual_time: 41 },
];
const radarData = [
  { metric: "Speed",    AI: 92, Manual: 45 },
  { metric: "Accuracy", AI: 88, Manual: 62 },
  { metric: "Cost",     AI: 85, Manual: 40 },
  { metric: "Scale",    AI: 95, Manual: 30 },
  { metric: "Bias",     AI: 78, Manual: 55 },
  { metric: "UX",       AI: 72, Manual: 70 },
];

const SH = ({ title }) => (
  <h3 style={{
    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14.5,
    color: "var(--text-primary)", marginBottom: 18,
  }}>{title}</h3>
);

export default function Analytics() {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Recruitment Analytics</div>
          <div className="page-subtitle">AI vs Traditional — Data-driven insights</div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="analytics-kpi-grid">
        {[
          { l: "Avg Time-to-Fill (AI)", v: "28.6 days", s: "↓ 44% vs manual",  c: "var(--accent)"  },
          { l: "Cost-per-Hire (AI)",    v: "₹58.4K",    s: "↓ 37% vs manual",  c: "var(--green)"   },
          { l: "Quality of Hire",       v: "4.1 / 5",   s: "↑ 21% vs manual",  c: "var(--blue)"    },
          { l: "Offer Acceptance",      v: "73.8%",      s: "+12 pts vs manual", c: "var(--yellow)"  },
        ].map(({ l, v, s, c }) => (
          <div key={l} className="stat-card">
            <div className="stat-value" style={{ color: c }}>{v}</div>
            <div className="stat-label">{l}</div>
            <div className="stat-change up">{s}</div>
          </div>
        ))}
      </div>

      {/* Charts 2-col grid → 1-col on mobile */}
      <div className="analytics-chart-grid">

        <div className="card">
          <SH title="AI vs Manual — Time-to-Fill (Days)" />
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={aiVsManual}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" />
              <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<Tip />} />
              <Legend wrapperStyle={{ fontSize: 12, fontFamily: "var(--font-body)" }} />
              <Line type="monotone" dataKey="ai_time"     name="AI Recruitment"     stroke="#c4622d" strokeWidth={2.5} dot={{ r: 4, fill: "#c4622d" }} />
              <Line type="monotone" dataKey="manual_time" name="Manual Recruitment" stroke="#9e9080" strokeWidth={2}   strokeDasharray="5 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <SH title="AI vs Manual — Performance Radar" />
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
              <Radar name="AI Recruitment" dataKey="AI"     stroke="#c4622d" fill="#c4622d" fillOpacity={0.2} />
              <Radar name="Manual"         dataKey="Manual" stroke="#9e9080" fill="#9e9080" fillOpacity={0.1} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <SH title="Candidate Source Effectiveness" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={sourceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" />
              <XAxis dataKey="source" tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<Tip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="count" name="Applications" fill="#ddd7c8" radius={[4,4,0,0]} />
              <Bar dataKey="hired" name="Hired"        fill="#c4622d" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <SH title="Top Skill Demand in IT Hiring" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={skillDemand} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" horizontal={false} />
              <XAxis type="number" domain={[0,100]} tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="skill" type="category" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} axisLine={false} tickLine={false} width={76} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="demand" name="Demand %" radius={[0,6,6,0]}>
                {skillDemand.map((_, i) => <Cell key={i} fill={C[i % C.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Full-width bottom chart */}
      <div className="card" style={{ marginTop: 18 }}>
        <SH title="Departmental Hiring — Target vs Achieved" />
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={deptHiring}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" />
            <XAxis dataKey="dept" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<Tip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="target"   name="Target"   fill="var(--bg-elevated)" stroke="var(--border)" strokeWidth={1.5} radius={[4,4,0,0]} />
            <Bar dataKey="achieved" name="Achieved"  fill="#c4622d" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
