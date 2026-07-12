import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3088/api",
  withCredentials: true,
});

export const getAssetsManagerDashboard = async () => {
  const response = await API.get("/asset-manager/assets-manager-dash");

  return response.data;
};
