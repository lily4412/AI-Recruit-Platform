import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../store/slices/authSlice";
import { Sparkles, Lock, User, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const schema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

export default function Login() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { loading, accessToken } = useSelector((s) => s.auth);
  const { register, handleSubmit, formState: { errors } } =
    useForm({ resolver: yupResolver(schema) });

  useEffect(() => { if (accessToken) navigate("/"); }, [accessToken]);

  const onSubmit = async (data) => {
    const res = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(res)) {
      toast.success("Welcome back!");
      navigate("/");
    } else {
      toast.error(res.payload || "Invalid credentials");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-base)",
      display: "flex",
      fontFamily: "var(--font-body)",
    }}>
      {/* ── Left panel — decorative ────────────────────── */}
      <div style={{
        width: "42%", background: "#2c2416",
        display: "flex", flexDirection: "column",
        justifyContent: "space-between",
        padding: "48px 52px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Warm texture rings */}
        <div style={{
          position: "absolute", bottom: -120, right: -120,
          width: 480, height: 480, borderRadius: "50%",
          border: "80px solid rgba(196,98,45,0.08)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -60, right: -60,
          width: 300, height: 300, borderRadius: "50%",
          border: "40px solid rgba(196,98,45,0.12)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: 100, left: -80,
          width: 260, height: 260, borderRadius: "50%",
          border: "50px solid rgba(255,255,255,0.03)",
          pointerEvents: "none",
        }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
          <div style={{
            width: 42, height: 42, borderRadius: 11,
            background: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 14px rgba(196,98,45,0.4)",
          }}>
            <Sparkles size={20} color="#fff" strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "#f0e8d8" }}>
              AI Recruit
            </div>
            <div style={{ fontSize: 10, color: "#7a6e58", letterSpacing: "0.8px", textTransform: "uppercase" }}>
              Platform
            </div>
          </div>
        </div>

        {/* Headline */}
        <div style={{ position: "relative" }}>
          <h2 style={{
            fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 700,
            color: "#f0e8d8", lineHeight: 1.25, marginBottom: 18,
            letterSpacing: "-0.5px",
          }}>
            Smarter hiring <br />
            <em style={{ color: "#f0a070", fontStyle: "italic" }}>starts here.</em>
          </h2>
          <p style={{ color: "#7a6e58", fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>
            AI-powered IT recruitment platform for Amity University Online — streamlining every step from sourcing to offer.
          </p>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 28, marginTop: 36 }}>
            {[["44.2%","Faster hiring"], ["36.9%","Cost reduction"], ["92.5%","AI accuracy"]].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "#f0a070" }}>{v}</div>
                <div style={{ fontSize: 11, color: "#7a6e58", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p style={{ fontSize: 11, color: "#4a4030", position: "relative" }}>
          MBA Final Year Project · Amity University Online · 2024-25
        </p>
      </div>

      {/* ── Right panel — form ────────────────────────── */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "48px 52px",
        background: "var(--bg-base)",
      }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <div style={{ marginBottom: 36 }}>
            <h1 style={{
              fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700,
              color: "var(--text-primary)", letterSpacing: "-0.4px", marginBottom: 8,
            }}>
              Welcome back
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
              Sign in to your recruitment dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <div style={{ position: "relative" }}>
                <User size={14} style={{
                  position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)",
                  color: "var(--text-muted)", pointerEvents: "none",
                }} />
                <input
                  {...register("username")}
                  placeholder="admin or priya.sharma"
                  className="form-control"
                  style={{ paddingLeft: 38 }}
                  autoComplete="username"
                />
              </div>
              {errors.username && <span className="form-error">{errors.username.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={14} style={{
                  position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)",
                  color: "var(--text-muted)", pointerEvents: "none",
                }} />
                <input
                  {...register("password")}
                  type="password" placeholder="••••••••"
                  className="form-control"
                  style={{ paddingLeft: 38 }}
                  autoComplete="current-password"
                />
              </div>
              {errors.password && <span className="form-error">{errors.password.message}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{
                width: "100%", justifyContent: "center",
                padding: "12px 20px", fontSize: 15, marginTop: 4,
                borderRadius: 10,
              }}
            >
              {loading ? (
                <><span className="spinner" style={{ width: 15, height: 15, borderWidth: 2 }} /> Signing in…</>
              ) : (
                <> Sign In <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          {/* Demo credentials card */}
          <div style={{
            marginTop: 28, padding: "14px 16px",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            borderLeft: "3px solid var(--accent)",
          }}>
            <p style={{
              fontSize: 10.5, fontWeight: 700, color: "var(--accent)",
              textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8,
            }}>
              Demo Credentials
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {/* <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "var(--text-muted)" }}>Admin</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)" }}>
                  admin / Admin@1234
                </span>
              </div> */}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "var(--text-muted)" }}>HR Manager</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)" }}>
                  priya.sharma / HR@1234
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
