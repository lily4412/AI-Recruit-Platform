import { useEffect, useState } from "react";
import api from "../services/api";
import { Loader, StatusBadge, EmptyState } from "../components/ui/index";
import { formatDate, formatSalary } from "../utils/helpers";
import { RefreshCw } from "lucide-react";

export default function Offers() {
  const [items, setItems] = useState([]);
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
        <button className="btn btn-secondary btn-sm" onClick={load}><RefreshCw size={14}/></button>
      </div>
      {loading ? <Loader /> : items.length === 0 ? (
        <EmptyState title="No offers found" subtitle="Offers appear here once extended to candidates" />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Candidate</th><th>Position</th><th>Offered Salary</th><th>Offer Date</th><th>Expiry</th><th>Joining</th><th>Status</th></tr>
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
      )}
    </div>
  );
}
