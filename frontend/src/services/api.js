// import axios from "axios";
// import { store } from "../store/store";
// import { clearAuth } from "../store/slices/authSlice";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
//   headers: { "Content-Type": "application/json" },
//   timeout: 15000,
// });

// // Request interceptor — attach Bearer token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("access_token");
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor — handle 401
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const original = error.config;
//     if (error.response?.status === 401 && !original._retry) {
//       original._retry = true;
//       const refresh = localStorage.getItem("refresh_token");
//       if (refresh) {
//         try {
//           const res = await axios.post(
//             `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api"}/auth/refresh/`,
//             { refresh }
//           );
//           const newAccess = res.data.access;
//           localStorage.setItem("access_token", newAccess);
//           original.headers.Authorization = `Bearer ${newAccess}`;
//           return api(original);
//         } catch (_) {
//           store.dispatch(clearAuth());
//           window.location.href = "/login";
//         }
//       } else {
//         store.dispatch(clearAuth());
//         window.location.href = "/login";
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;


import axios from "axios";
import { clearAuth } from "../store/slices/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const refresh = localStorage.getItem("refresh_token");

      if (refresh) {
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api"}/auth/refresh/`,
            { refresh }
          );

          const newAccess = res.data.access;

          localStorage.setItem("access_token", newAccess);

          original.headers.Authorization = `Bearer ${newAccess}`;

          return api(original);
        } catch (err) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");

          window.location.href = "/login";
        }
      } else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
