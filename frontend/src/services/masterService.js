import api from "./api";

export const masterService = {
  getDepartments:    () => api.get("/master/departments/?page_size=100"),
  getSkills:         () => api.get("/master/skills/?page_size=200"),
  getJobLevels:      () => api.get("/master/job-levels/?page_size=20"),
  getAITools:        () => api.get("/master/ai-tools/?page_size=50"),
  getEmploymentTypes:() => api.get("/master/employment-types/?page_size=20"),
  getLocations:      () => api.get("/master/locations/?page_size=100"),
};
