// apiClient.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://quizzie-cuvette-backend.onrender.com/api/v1", // Set your base API URL here
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
