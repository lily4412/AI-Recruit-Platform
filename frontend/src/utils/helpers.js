export const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

export const formatSalary = (n) =>
  n ? `₹${(n / 100000).toFixed(1)}L` : "—";

export const getStatusBadge = (status) => {
  const map = {
    open: "badge-green", draft: "badge-gray", closed: "badge-red",
    filled: "badge-blue", on_hold: "badge-yellow",
    applied: "badge-gray", ai_screening: "badge-purple",
    shortlisted: "badge-blue", interview_scheduled: "badge-yellow",
    interviewed: "badge-purple", offer_extended: "badge-yellow",
    hired: "badge-green", rejected: "badge-red", withdrawn: "badge-gray",
    scheduled: "badge-blue", completed: "badge-green",
    cancelled: "badge-red", no_show: "badge-red",
    pass: "badge-green", fail: "badge-red", pending: "badge-yellow",
    extended: "badge-yellow", accepted: "badge-green", declined: "badge-red",
    revoked: "badge-red", expired: "badge-gray",
  };
  return map[status] || "badge-gray";
};

export const getAIScoreColor = (score) => {
  if (!score) return "var(--text-muted)";
  if (score >= 80) return "var(--green)";
  if (score >= 60) return "var(--yellow)";
  return "var(--red)";
};

export const truncate = (str, n = 60) =>
  str && str.length > n ? str.slice(0, n) + "…" : str || "";

export const debounce = (fn, delay = 400) => {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
};
