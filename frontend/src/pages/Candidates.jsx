import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Plus, Search, RefreshCw, Eye, Pencil, Trash2, Cpu } from "lucide-react";
import { fetchCandidates, createCandidate, updateCandidate, deleteCandidate } from "../store/slices/candidatesSlice";
import { candidatesService } from "../services/candidatesService";
import { useMasterData } from "../hooks/useMasterData";
import { Loader, Modal, StatusBadge, Pagination, EmptyState, AIScoreBar } from "../components/ui/index";
import { formatDate, debounce } from "../utils/helpers";
import toast from "react-hot-toast";

const schema = yup.object({
  first_name: yup.string().required("First name required"),
  last_name:  yup.string().required("Last name required"),
  email:      yup.string().email("Invalid email").required("Email required"),
  phone:      yup.string().required("Phone required"),
  total_experience: yup.number().min(0).required(),
});

export default function Candidates() {
  const dispatch = useDispatch();
  const { items, total, loading } = useSelector((s) => s.candidates);
  const master = useMasterData();
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm({ resolver: yupResolver(schema) });

  const load = useCallback(() => {
    dispatch(fetchCandidates({ page, search }));
  }, [page, search]);

  useEffect(() => { load(); }, [load]);
  const debouncedSearch = useCallback(debounce((v) => { setSearch(v); setPage(1); }), []);

  const openCreate = () => { setEditing(null); reset({}); setModalOpen(true); };
  const openEdit   = (c) => {
    setEditing(c);
    reset({ first_name: c.first_name, last_name: c.last_name, email: c.email,
            phone: c.phone, total_experience: c.total_experience,
            current_company: c.current_company, current_title: c.current_title,
            source: c.source, linkedin_url: c.linkedin_url, github_url: c.github_url });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    const action = editing
      ? dispatch(updateCandidate({ id: editing.id, data }))
      : dispatch(createCandidate(data));
    const res = await action;
    const thunk = editing ? updateCandidate : createCandidate;
    if (thunk.fulfilled.match(res)) {
      toast.success(editing ? "Candidate updated!" : "Candidate added!");
      setModalOpen(false); load();
    } else toast.error("Error saving candidate");
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this candidate?")) return;
    const res = await dispatch(deleteCandidate(id));
    if (deleteCandidate.fulfilled.match(res)) { toast.success("Removed"); load(); }
  };

  const handleAIScore = async (id) => {
    try {
      const res = await candidatesService.aiScore(id);
      toast.success(`AI Score: ${res.data?.data?.ai_profile_score}%`);
      load();
    } catch { toast.error("AI scoring failed"); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Candidates</div>
          <div className="page-subtitle">{total} profiles in talent pool</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary btn-sm" onClick={load}><RefreshCw size={14}/></button>
          <button className="btn btn-primary" onClick={openCreate}><Plus size={15}/> Add Candidate</button>
        </div>
      </div>

      <div className="toolbar">
        <div className="search-wrap">
          <Search size={14} className="search-icon" />
          <input placeholder="Search by name, email, company…" className="form-control"
            onChange={(e) => debouncedSearch(e.target.value)} />
        </div>
      </div>

      {loading ? <Loader /> : items.length === 0 ? (
        <EmptyState title="No candidates found" subtitle="Add your first candidate to the talent pool" />
      ) : (
        <>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>Email</th><th>Current Role</th>
                  <th>Experience</th><th>Source</th><th>AI Profile Score</th>
                  <th>Applications</th><th>Added</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c.id}>
                    <td><span style={{ fontFamily: "monospace", fontSize: 11, color: "var(--accent)" }}>{c.candidate_id}</span></td>
                    <td>
                      <Link to={`/candidates/${c.id}`} style={{ color: "var(--text-primary)", fontWeight: 600, textDecoration: "none" }}>
                        {c.full_name || `${c.first_name} ${c.last_name}`}
                      </Link>
                    </td>
                    <td style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>{c.email}</td>
                    <td style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>
                      {c.current_title}<br/>
                      <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{c.current_company}</span>
                    </td>
                    <td style={{ textAlign: "center" }}>{c.total_experience} yrs</td>
                    <td><span className="badge badge-gray">{c.source_display || c.source}</span></td>
                    <td style={{ minWidth: 150 }}><AIScoreBar score={c.ai_profile_score} /></td>
                    <td style={{ textAlign: "center" }}>
                      <Link to={`/applications?candidate=${c.id}`} style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
                        {c.application_count ?? 0}
                      </Link>
                    </td>
                    <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{formatDate(c.created_at)}</td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <Link to={`/candidates/${c.id}`}><button className="btn btn-icon btn-ghost btn-sm" title="View"><Eye size={14}/></button></Link>
                        <button className="btn btn-icon btn-ghost btn-sm" onClick={() => openEdit(c)} title="Edit"><Pencil size={14}/></button>
                        <button className="btn btn-icon btn-sm" onClick={() => handleAIScore(c.id)} title="Run AI Score"
                          style={{ background: "rgba(196,98,45,0.1)", color: "var(--accent)" }}>
                          <Cpu size={14}/>
                        </button>
                        <button className="btn btn-icon btn-danger btn-sm" onClick={() => handleDelete(c.id)}><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} total={total} onChange={setPage} />
        </>
      )}

      {modalOpen && (
        <Modal title={editing ? "Edit Candidate" : "Add New Candidate"}
          onClose={() => setModalOpen(false)} wide
          footer={<>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit(onSubmit)}>
              {editing ? "Save Changes" : "Add Candidate"}
            </button>
          </>}>
          <form style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">First Name *</label>
                <input {...register("first_name")} className="form-control" />
                {errors.first_name && <span className="form-error">{errors.first_name.message}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Last Name *</label>
                <input {...register("last_name")} className="form-control" />
                {errors.last_name && <span className="form-error">{errors.last_name.message}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input {...register("email")} type="email" className="form-control" />
                {errors.email && <span className="form-error">{errors.email.message}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Phone *</label>
                <input {...register("phone")} className="form-control" />
                {errors.phone && <span className="form-error">{errors.phone.message}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Current Company</label>
                <input {...register("current_company")} className="form-control" />
              </div>
              <div className="form-group">
                <label className="form-label">Current Title</label>
                <input {...register("current_title")} className="form-control" />
              </div>
              <div className="form-group">
                <label className="form-label">Experience (years) *</label>
                <input {...register("total_experience")} type="number" step="0.5" min="0" className="form-control" />
                {errors.total_experience && <span className="form-error">{errors.total_experience.message}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Source</label>
                <select {...register("source")} className="form-control">
                  {["portal","linkedin","referral","campus","agency","direct","ai_sourced"].map(s => (
                    <option key={s} value={s}>{s.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase())}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">LinkedIn URL</label>
                <input {...register("linkedin_url")} type="url" className="form-control" placeholder="https://linkedin.com/in/…" />
              </div>
              <div className="form-group">
                <label className="form-label">GitHub URL</label>
                <input {...register("github_url")} type="url" className="form-control" placeholder="https://github.com/…" />
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
