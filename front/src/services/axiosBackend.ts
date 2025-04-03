import axios from "axios";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    Authorization: `Bearer ${localStorage.getItem("ACCESS")}`,
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ACCESS");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized! Clearing token...");
      localStorage.removeItem("ACCESS");
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
