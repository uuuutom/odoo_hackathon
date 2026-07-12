import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3088/api",
  withCredentials: true, // This is mandatory to send and receive JWT cookies
});

export default api;
