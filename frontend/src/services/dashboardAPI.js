import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3088/api",
  withCredentials: true,
});

export const getDashboardStats = () => API.get("/dashboard/stats");
