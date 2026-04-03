import axios from "axios";
import { AUTH_LOGOUT_EVENT } from "@/context/authEvents";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const axiosClient = axios.create({
  baseURL: `${baseUrl}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = String(error.config?.url ?? "");
    const isLoginRequest = requestUrl.includes("/login");

    if (error.response && error.response.status === 401 && !isLoginRequest) {
      console.log("Unauthorized! Clearing token...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
