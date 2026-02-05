import axios from "axios";
import { toast } from "react-toastify";

const adminApi = axios.create({
  baseURL: "/api",
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

adminApi.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("api_token") : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

adminApi.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const status = error.response?.status;

    if (status === 401 && typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path.startsWith("/admin")) {
        window.location.replace("/admin/login");
      } else {
        window.location.replace("/login");
      }
      return toast.error("Session expired. Please log in again.");
    }

    return Promise.reject(error);
  }
);

export default adminApi;
