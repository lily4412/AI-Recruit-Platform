import api from "./api";

export const applicationsService = {
  getAll:        (params) => api.get("/applications/", { params }),
  getOne:        (id)     => api.get(`/applications/${id}/`),
  create:        (data)   => api.post("/applications/", data),
  update:        (id, d)  => api.patch(`/applications/${id}/`, d),
  delete:        (id)     => api.delete(`/applications/${id}/`),
  aiScreen:      (id)     => api.post(`/applications/${id}/ai-screen/`),
  updateStatus:  (id, d)  => api.patch(`/applications/${id}/update-status/`, d),
};
