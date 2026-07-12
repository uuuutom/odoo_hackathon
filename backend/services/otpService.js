import redisClient from "../config/redis.js";
import { generateOTP } from "../utils/generateOTP.js";

export const createOTP = async (email) => {
  const otp = generateOTP();

  console.log("Creating OTP:", otp);

  await redisClient.set(`otp:${email}`, otp, {
    EX: 300,
  });

  console.log("OTP saved");

  return otp;
};

export const verifyOTP = async (email, otp) => {
  const savedOTP = await redisClient.get(`otp:${email}`);

  if (!savedOTP) {
    return false;
  }

  if (savedOTP !== otp) {
    return false;
  }

  await redisClient.del(`otp:${email}`);

  return true;
};

export const saveSignupData = async (email, userData) => {
  console.log("Saving signup data");
  await redisClient.set(`signup:${email}`, JSON.stringify(userData), {
    EX: 300,
  });
  console.log("Signup data saved");
};

export const getSignupData = async (email) => {
  const data = await redisClient.get(`signup:${email}`);

  if (!data) return null;

  return JSON.parse(data);
};

export const deleteSignupData = async (email) => {
  await redisClient.del(`signup:${email}`);
};
