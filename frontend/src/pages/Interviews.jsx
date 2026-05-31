// Interviews.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import { Loader, StatusBadge, EmptyState } from "../components/ui/index";
import { formatDate } from "../utils/helpers";
import { Calendar, RefreshCw } from "lucide-react";

export default function Interviews() {
  const [items, setItems] = useState([]);
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

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Interviews</div>
          <div className="page-subtitle">Scheduled and completed interview sessions</div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={load}><RefreshCw size={14}/></button>
      </div>
      {loading ? <Loader /> : items.length === 0 ? (
        <EmptyState title="No interviews scheduled" subtitle="Interviews will appear here once applications are shortlisted" />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Candidate</th><th>Position</th><th>Type</th><th>Round</th><th>Scheduled</th><th>Duration</th><th>Status</th><th>Result</th><th>Rating</th></tr>
            </thead>
            <tbody>
              {items.map(iv => (
                <tr key={iv.id}>
                  <td style={{ fontWeight: 600 }}>{iv.candidate_name || "—"}</td>
                  <td style={{ color: "var(--text-secondary)", fontSize: 12.5 }}>{iv.requisition_title || "—"}</td>
                  <td><span className="badge badge-blue" style={{ fontSize: 11 }}>{iv.type_display}</span></td>
                  <td style={{ textAlign: "center" }}>#{iv.round_number}</td>
                  <td style={{ fontSize: 12.5 }}>{iv.scheduled_at ? new Date(iv.scheduled_at).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—"}</td>
                  <td style={{ textAlign: "center", color: "var(--text-muted)" }}>{iv.duration_mins} min</td>
                  <td><StatusBadge status={iv.status} /></td>
                  <td><StatusBadge status={iv.result} /></td>
                  <td style={{ textAlign: "center" }}>
                    {iv.rating ? <span style={{ color: "#f59e0b", fontWeight: 700 }}>{"★".repeat(iv.rating)}{"☆".repeat(5 - iv.rating)}</span> : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
