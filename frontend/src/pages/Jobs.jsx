import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Plus, Search, RefreshCw, Eye, Pencil, Trash2, Send } from "lucide-react";
import { fetchJobs, createJob, updateJob, deleteJob } from "../store/slices/jobsSlice";
import { jobsService } from "../services/jobsService";
import { useMasterData } from "../hooks/useMasterData";
import { Loader, Modal, StatusBadge, Pagination, EmptyState } from "../components/ui/index";
import { formatDate, formatSalary, debounce } from "../utils/helpers";
import toast from "react-hot-toast";

const schema = yup.object({
  title:           yup.string().required("Title is required"),
  department:      yup.number().required("Department is required"),
  level:           yup.number().required("Level is required"),
  employment_type: yup.number().required("Employment type is required"),
  location:        yup.number().required("Location is required"),
  min_experience:  yup.number().min(0).required(),
  max_experience:  yup.number().min(0).required(),
  vacancies:       yup.number().min(1).required(),
  description:     yup.string().required("Description is required"),
});

export default function Jobs() {
  const dispatch = useDispatch();
  const { items, total, loading } = useSelector((s) => s.jobs);
  const master = useMasterData();
  const [page, setPage]         = useState(1);
  const [search, setSearch]     = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]   = useState(null);

  const { register, handleSubmit, reset, control, formState: { errors } } =
    useForm({ resolver: yupResolver(schema) });

  const load = useCallback(() => {
    dispatch(fetchJobs({ page, search, status: statusFilter || undefined }));
  }, [page, search, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const debouncedSearch = useCallback(debounce((v) => { setSearch(v); setPage(1); }), []);

  const openCreate = () => { setEditing(null); reset({}); setModalOpen(true); };
  const openEdit   = (job) => {
    setEditing(job);
    reset({
      title: job.title, department: job.department, level: job.level,
      employment_type: job.employment_type, location: job.location,
      min_experience: job.min_experience, max_experience: job.max_experience,
      vacancies: job.vacancies, description: job.description,
      min_salary: job.min_salary, max_salary: job.max_salary,
      ai_score_threshold: job.ai_score_threshold,
    });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    const action = editing
      ? dispatch(updateJob({ id: editing.id, data }))
      : dispatch(createJob(data));
    const res = await action;
    if ((editing ? updateJob : createJob).fulfilled.match(res)) {
      toast.success(editing ? "Job updated!" : "Job created!");
      setModalOpen(false);
      load();
    } else toast.error(res.payload || "Error saving job");
  };

  const handleDelete = async (id) => {
    if (!confirm("Deactivate this job requisition?")) return;
    const res = await dispatch(deleteJob(id));
    if (deleteJob.fulfilled.match(res)) { toast.success("Job deactivated"); load(); }
  };

  const handlePublish = async (id) => {
    try {
      await jobsService.publish(id);
      toast.success("Job published!");
      load();
    } catch { toast.error("Failed to publish"); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Job Openings</div>
          <div className="page-subtitle">{total} requisitions · {items.filter(j=>j.status==="open").length} open</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary btn-sm" onClick={load}><RefreshCw size={14}/></button>
          <button className="btn btn-primary" onClick={openCreate}><Plus size={15}/> New Job</button>
        </div>
      </div>

      <div className="toolbar">
        <div className="search-wrap">
          <Search size={14} className="search-icon" />
          <input placeholder="Search by title, job ID…" className="form-control"
            onChange={(e) => debouncedSearch(e.target.value)} />
        </div>
        <select className="form-control" style={{ width: 160 }}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">All Statuses</option>
          {["draft","open","on_hold","closed","filled"].map(s => (
            <option key={s} value={s}>{s.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase())}</option>
          ))}
        </select>
      </div>

      {loading ? <Loader /> : items.length === 0 ? (
        <EmptyState title="No jobs found" subtitle="Create your first job requisition" />
      ) : (
        <>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Job ID</th><th>Title</th><th>Department</th><th>Level</th>
                  <th>Location</th><th>Vacancies</th><th>Applications</th>
                  <th>Salary Range</th><th>Status</th><th>Posted</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((job) => (
                  <tr key={job.id}>
                    <td><span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--accent)" }}>{job.job_id}</span></td>
                    <td><Link to={`/jobs/${job.id}`} style={{ color: "var(--text-primary)", fontWeight: 600, textDecoration: "none" }}>{job.title}</Link></td>
                    <td style={{ color: "var(--text-secondary)" }}>{job.department_detail?.name || "—"}</td>
                    <td style={{ color: "var(--text-secondary)" }}>{job.level_detail?.name || "—"}</td>
                    <td style={{ color: "var(--text-secondary)", fontSize: 12 }}>{job.location_detail?.city || "—"}</td>
                    <td style={{ textAlign: "center" }}>{job.vacancies}</td>
                    <td style={{ textAlign: "center" }}>
                      <Link to={`/applications?requisition=${job.id}`} style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
                        {job.application_count ?? 0}
                      </Link>
                    </td>
                    <td style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                      {job.min_salary && job.max_salary ? `${formatSalary(job.min_salary)} – ${formatSalary(job.max_salary)}` : "—"}
                    </td>
                    <td><StatusBadge status={job.status} /></td>
                    <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{formatDate(job.created_at)}</td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <Link to={`/jobs/${job.id}`}><button className="btn btn-icon btn-ghost btn-sm" title="View"><Eye size={14}/></button></Link>
                        <button className="btn btn-icon btn-ghost btn-sm" onClick={() => openEdit(job)} title="Edit"><Pencil size={14}/></button>
                        {job.status === "draft" && (
                          <button className="btn btn-icon btn-sm" onClick={() => handlePublish(job.id)}
                            title="Publish" style={{ background: "rgba(16,185,129,0.15)", color: "var(--green)" }}>
                            <Send size={14}/>
                          </button>
                        )}
                        <button className="btn btn-icon btn-danger btn-sm" onClick={() => handleDelete(job.id)} title="Delete"><Trash2 size={14}/></button>
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
        <Modal title={editing ? "Edit Job Requisition" : "New Job Requisition"}
          onClose={() => setModalOpen(false)} wide
          footer={<>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit(onSubmit)}>
              {editing ? "Save Changes" : "Create Job"}
            </button>
          </>}>
          <form style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="form-group">
              <label className="form-label">Job Title *</label>
              <input {...register("title")} className="form-control" placeholder="e.g. Senior Python Developer" />
              {errors.title && <span className="form-error">{errors.title.message}</span>}
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Department *</label>
                <select {...register("department")} className="form-control">
                  <option value="">Select…</option>
                  {master.departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
                {errors.department && <span className="form-error">{errors.department.message}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Level *</label>
                <select {...register("level")} className="form-control">
                  <option value="">Select…</option>
                  {master.jobLevels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Employment Type *</label>
                <select {...register("employment_type")} className="form-control">
                  <option value="">Select…</option>
                  {master.employmentTypes.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Location *</label>
                <select {...register("location")} className="form-control">
                  <option value="">Select…</option>
                  {master.locations.map(l => <option key={l.id} value={l.id}>{l.city}{l.is_remote ? " (Remote)" : ""}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Min Experience (yrs)</label>
                <input {...register("min_experience")} type="number" min="0" className="form-control" defaultValue={0} />
              </div>
              <div className="form-group">
                <label className="form-label">Max Experience (yrs)</label>
                <input {...register("max_experience")} type="number" min="0" className="form-control" defaultValue={10} />
              </div>
              <div className="form-group">
                <label className="form-label">Min Salary (₹)</label>
                <input {...register("min_salary")} type="number" className="form-control" />
              </div>
              <div className="form-group">
                <label className="form-label">Max Salary (₹)</label>
                <input {...register("max_salary")} type="number" className="form-control" />
              </div>
              <div className="form-group">
                <label className="form-label">Vacancies</label>
                <input {...register("vacancies")} type="number" min="1" className="form-control" defaultValue={1} />
              </div>
              <div className="form-group">
                <label className="form-label">AI Score Threshold (%)</label>
                <input {...register("ai_score_threshold")} type="number" min="0" max="100"
                  className="form-control" defaultValue={70} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Job Description *</label>
              <textarea {...register("description")} className="form-control" rows={4}
                placeholder="Describe the role, requirements and what you're looking for…" />
              {errors.description && <span className="form-error">{errors.description.message}</span>}
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
