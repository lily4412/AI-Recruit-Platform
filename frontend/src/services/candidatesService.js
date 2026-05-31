import api from "./api";

export const candidatesService = {
  getAll:   (params) => api.get("/candidates/", { params }),
  getOne:   (id)     => api.get(`/candidates/${id}/`),
  create:   (data)   => api.post("/candidates/", data),
  update:   (id, d)  => api.patch(`/candidates/${id}/`, d),
  delete:   (id)     => api.delete(`/candidates/${id}/`),
  aiScore:  (id)     => api.post(`/candidates/${id}/ai-score/`),
};
