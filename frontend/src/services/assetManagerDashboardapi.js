import axios from "axios";

export const getAssetsManagerDashboard = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3088/api/asset-manager/assets-manager-dash",
      {
        // THIS IS THE FIX: It forces Axios to send your login cookies
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    console.error("API Error fetching dashboard:", error);
    throw error;
  }
};
