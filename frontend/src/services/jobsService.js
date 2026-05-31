import api from "./api";

export const jobsService = {
  getAll:     (params) => api.get("/jobs/", { params }),
  getOne:     (id)     => api.get(`/jobs/${id}/`),
  create:     (data)   => api.post("/jobs/", data),
  update:     (id, d)  => api.patch(`/jobs/${id}/`, d),
  delete:     (id)     => api.delete(`/jobs/${id}/`),
  publish:    (id)     => api.post(`/jobs/${id}/publish/`),
  getApplications: (id) => api.get(`/jobs/${id}/applications/`),
};
