import axios from "axios";

// ✅ Base URL from environment variable
const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`, // Ensure this is set in Vercel
  timeout: 10000, // optional: 10 seconds timeout
});

// ✅ Attach JWT token to every request automatically
API.interceptors.request.use(
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

export default API;
