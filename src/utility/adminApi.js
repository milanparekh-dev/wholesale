import axios from "axios";

const adminApi = axios.create({
  baseURL: "/api",
});

adminApi.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default adminApi;
