import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard, Briefcase, Users, FileText,
  Calendar, Gift, Bot, BarChart3, LogOut,
  ChevronRight, Sparkles, X,
} from "lucide-react";
import { logoutUser } from "../../store/slices/authSlice";
import toast from "react-hot-toast";

const NAV = [
  { label: "Dashboard",    to: "/",            icon: LayoutDashboard },
  { label: "Job Openings", to: "/jobs",         icon: Briefcase },
  { label: "Candidates",   to: "/candidates",   icon: Users },
  { label: "Applications", to: "/applications", icon: FileText },
  { label: "Interviews",   to: "/interviews",   icon: Calendar },
  { label: "Offers",       to: "/offers",       icon: Gift },
  { label: "AI Tools",     to: "/ai-tools",     icon: Bot },
  { label: "Analytics",    to: "/analytics",    icon: BarChart3 },
];

export default function Sidebar({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user     = useSelector((s) => s.auth.user);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success("Signed out successfully");
    navigate("/login");
  };

  const handleNavClick = () => {
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) onClose?.();
  };

  const initials = user?.first_name
    ? `${user.first_name[0]}${user.last_name?.[0] || ""}`.toUpperCase()
    : (user?.username?.[0] || "U").toUpperCase();

  return (
    <>
      {/* ── Mobile backdrop overlay ──────────────────────── */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            display: "none",
            position: "fixed", inset: 0,
            background: "rgba(30,24,16,0.55)",
            backdropFilter: "blur(2px)",
            zIndex: 99,
            animation: "fadeIn 0.2s ease",
          }}
          className="sidebar-overlay"
        />
      )}

      <aside style={{
        position: "fixed", top: 0, left: 0, bottom: 0,
        width: "var(--sidebar-w)",
        background: "var(--bg-sidebar)",
        borderRight: "1px solid rgba(255,255,255,0.07)",
        display: "flex", flexDirection: "column",
        zIndex: 100,
        // Mobile: slide in/out
        transform: "translateX(0)",
        transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
      }}
        className={`app-sidebar ${isOpen ? "sidebar-open" : ""}`}
      >
        {/* ── Brand ─────────────────────────────────────────── */}
        <div style={{
          padding: "18px 20px 16px",
          borderBottom: "1px solid var(--sidebar-border)",
          height: "var(--header-h)",
          display: "flex", alignItems: "center", gap: 11,
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 2px 8px rgba(196,98,45,0.35)",
          }}>
            <Sparkles size={16} color="#fff" strokeWidth={2} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700, fontSize: 15.5,
              color: "#f0e8d8", letterSpacing: "-0.2px",
              lineHeight: 1.2,
            }}>
              AI Recruit
            </div>
            <div style={{ fontSize: 10, color: "var(--sidebar-text-muted)", letterSpacing: "0.8px", textTransform: "uppercase" }}>
              Platform
            </div>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="sidebar-close-btn"
            style={{
              display: "none", // shown via CSS on mobile
              width: 30, height: 30, borderRadius: 7,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--sidebar-text-muted)",
              alignItems: "center", justifyContent: "center",
              cursor: "pointer", flexShrink: 0,
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* ── Navigation ────────────────────────────────────── */}
        <nav style={{ flex: 1, padding: "16px 10px", overflowY: "auto" }}>
          <p style={{
            fontSize: 9.5, fontWeight: 700,
            color: "var(--sidebar-text-muted)",
            padding: "0 10px 8px",
            textTransform: "uppercase", letterSpacing: "1.2px",
          }}>
            Navigation
          </p>

          {NAV.map(({ label, to, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === "/"} onClick={handleNavClick} style={{ textDecoration: "none", display: "block" }}>
              {({ isActive }) => (
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8.5px 10px", borderRadius: 8, marginBottom: 1,
                  cursor: "pointer", transition: "all 0.14s ease",
                  background: isActive ? "var(--sidebar-active-bg)" : "transparent",
                  color: isActive ? "var(--sidebar-active-txt)" : "var(--sidebar-text)",
                  fontWeight: isActive ? 600 : 400,
                  border: isActive ? "1px solid rgba(196,98,45,0.25)" : "1px solid transparent",
                }}>
                  <Icon size={15} strokeWidth={isActive ? 2.2 : 1.7} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 13.5, flex: 1, fontFamily: "var(--font-body)" }}>
                    {label}
                  </span>
                  {isActive && <ChevronRight size={12} style={{ opacity: 0.7 }} />}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ── User Footer ───────────────────────────────────── */}
        <div style={{ borderTop: "1px solid var(--sidebar-border)", padding: "14px 10px" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 10px", borderRadius: 10,
            background: "rgba(255,255,255,0.05)",
            marginBottom: 8, border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent) 0%, #e89052 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-body)", fontWeight: 700,
              fontSize: 12.5, color: "#fff", flexShrink: 0,
              border: "2px solid rgba(255,255,255,0.12)",
            }}>
              {initials}
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{
                fontSize: 13, fontWeight: 600, color: "#e8dcc8",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {user?.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : user?.username}
              </div>
              <div style={{ fontSize: 11, color: "var(--sidebar-text-muted)", marginTop: 1 }}>
                {user?.profile?.role?.replace(/_/g, " ") || "Recruiter"}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              width: "100%", padding: "8px 10px", borderRadius: 8,
              background: "transparent", border: "1px solid transparent",
              color: "var(--sidebar-text-muted)", cursor: "pointer",
              fontFamily: "var(--font-body)", fontSize: 13,
              transition: "all 0.14s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(192,57,43,0.12)";
              e.currentTarget.style.color = "#f0a080";
              e.currentTarget.style.borderColor = "rgba(192,57,43,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--sidebar-text-muted)";
              e.currentTarget.style.borderColor = "transparent";
            }}
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
