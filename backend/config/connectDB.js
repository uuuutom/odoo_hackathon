import mongoose from "mongoose";
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

export const connectDB = async () => {
  try {
    // console.log(process.env.MONGODB_URL);
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("db connected");
    console.log("Mongoose Ready State:", mongoose.connection.readyState);
  } catch (error) {
    console.log("db connection err", error);
  }
};
