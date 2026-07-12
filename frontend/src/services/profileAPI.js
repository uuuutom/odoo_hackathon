import axios from "axios";

export const getProfile = async () => {
  const res = await axios.get("http://localhost:3088/api/user/profile", {
    withCredentials: true,
  });

  return res.data;
};
