import { useNavigate } from "react-router-dom";
import { Bot } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg-base)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 16,
      padding: "24px 20px", textAlign: "center",
    }}>
      <Bot size={56} style={{ color: "var(--accent)", opacity: 0.4 }} />
      <h1 className="notfound-number">404</h1>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700 }}>Page not found</h2>
      <p style={{ color: "var(--text-muted)", fontSize: 14, maxWidth: 300 }}>
        The page you're looking for doesn't exist.
      </p>
      <button className="btn btn-primary" onClick={() => navigate("/")}>Go to Dashboard</button>
    </div>
  );
}
