import { useEffect, useState } from "react";
import { masterService } from "../services/masterService";
import { Loader } from "../components/ui/index";
import { Bot, CheckCircle, AlertCircle, Zap } from "lucide-react";

const TYPE_ICONS = {
  ats: "📋", screening: "🔍", chatbot: "💬", video_ai: "🎥",
  predictive: "📊", jd_optimizer: "✍️", sourcing: "🎯",
};

export default function AITools() {
  const [tools, setTools] = useState([]);
  const [usage, setUsage] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([masterService.getAITools(), import("../services/api").then(m => m.default.get("/transactions/ai-usage/?page_size=10"))])
      .then(([tr, ur]) => {
        const td = tr.data?.data;
        setTools(td?.results ?? (Array.isArray(td) ? td : []));
        const ud = ur.data?.data;
        setUsage(ud?.results ?? (Array.isArray(ud) ? ud : []));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">AI Tools & Integrations</div>
          <div className="page-subtitle">AI-powered recruitment tools driving your hiring pipeline</div>
        </div>
      </div>

      {/* AI Impact Banner */}
      <div className="card" style={{ background: "linear-gradient(135deg,rgba(196,98,45,0.08),rgba(139,92,246,0.08))", border: "1px solid rgba(196,98,45,0.2)", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <Bot size={22} style={{ color: "var(--accent)" }} />
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>AI Recruitment Impact</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {[
            ["44.2%", "Faster Time-to-Fill", "51.3 → 28.6 days average"],
            ["36.9%", "Cost-per-Hire Reduction", "₹92.6K → ₹58.4K"],
            ["20.6%", "Quality of Hire Increase", "Score 3.4 → 4.1/5.0"],
            ["75.7%", "AI Adoption Rate", "Among IT organisations"],
          ].map(([val, label, sub]) => (
            <div key={label} style={{ textAlign: "center", padding: "14px 10px", background: "var(--bg-card)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "var(--accent)" }}>{val}</div>
              <div style={{ fontSize: 12, fontWeight: 600, marginTop: 6, color: "var(--text-primary)" }}>{label}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tool Cards */}
      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: 16, fontSize: 15 }}>
        Registered AI Tools ({tools.length})
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 28 }}>
        {tools.map(tool => (
          <div key={tool.id} className="card" style={{ position: "relative", overflow: "hidden" }}>
            {tool.is_integrated && (
              <div style={{ position: "absolute", top: 12, right: 12 }}>
                <span className="badge badge-green" style={{ fontSize: 10 }}><CheckCircle size={10}/> LIVE</span>
              </div>
            )}
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ fontSize: 24 }}>{TYPE_ICONS[tool.tool_type] || "🤖"}</div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: 14 }}>{tool.name}</h4>
                <p style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{tool.vendor}</p>
              </div>
            </div>
            <p style={{ fontSize: 12.5, color: "var(--text-secondary)", marginBottom: 12, lineHeight: 1.5 }}>
              {tool.description || tool.tool_type_display}
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="badge badge-gray" style={{ fontSize: 11 }}>{tool.tool_type_display}</span>
              {tool.accuracy_pct && (
                <span style={{ fontSize: 12, color: "var(--green)", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                  <Zap size={11}/> {tool.accuracy_pct}% accuracy
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Recent AI Usage */}
      {usage.length > 0 && (
        <>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Recent AI Activity</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Tool</th><th>Candidate</th><th>Score</th><th>Notes</th><th>Used By</th><th>Date</th></tr></thead>
              <tbody>
                {usage.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600, fontSize: 13 }}>{u.tool_name}</td>
                    <td style={{ color: "var(--text-secondary)", fontSize: 12.5 }}>{u.candidate_name || "—"}</td>
                    <td>{u.score_generated ? <span style={{ color: "var(--accent)", fontWeight: 700 }}>{u.score_generated}%</span> : "—"}</td>
                    <td style={{ fontSize: 12, color: "var(--text-muted)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.output_notes || "—"}</td>
                    <td style={{ fontSize: 12.5 }}>{u.used_by_name || "System"}</td>
                    <td style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{u.created_at ? new Date(u.created_at).toLocaleDateString("en-IN") : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
