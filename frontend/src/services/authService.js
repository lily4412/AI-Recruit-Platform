import api from "./api";

export const authService = {
  login:   (data)   => api.post("/auth/login/", data),
  logout:  (data)   => api.post("/auth/logout/", data),
  profile: ()       => api.get("/auth/profile/"),
  refresh: (data)   => api.post("/auth/refresh/", data),
};

export const dashboardService = {
  getStats: () => api.get("/dashboard/stats/"),
};
