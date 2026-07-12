import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/userModel.js";

import path from "path";
import { fileURLToPath } from "url";
import dns from "dns";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../.env"),
});

dns.setServers(["8.8.8.8", "8.8.4.4"]);

await mongoose.connect(process.env.MONGODB_URL);

const users = [
  {
    name: "Super Admin",
    email: "admin@test.com",
    role: "ADMIN",
    emailVerified: true,
    status: "ACTIVE",
  },

  {
    name: "Asset Manager",
    email: "assetmanager@test.com",
    role: "ASSET_MANAGER",
    emailVerified: true,
    status: "ACTIVE",
  },

  {
    name: "Department Head",
    email: "departmenthead@test.com",
    role: "DEPARTMENT_HEAD",
    emailVerified: true,
    status: "ACTIVE",
  },
];

const createRoles = async () => {
  try {
    for (const userData of users) {
      const user = await User.findOneAndUpdate(
        {
          email: userData.email,
        },

        userData,

        {
          upsert: true,
          new: true,
        },
      );

      console.log(`${user.role} created successfully`);
    }
  } catch (error) {
    console.log("Role creation error:", error.message);
  } finally {
    await mongoose.disconnect();

    process.exit();
  }
};

createRoles();
