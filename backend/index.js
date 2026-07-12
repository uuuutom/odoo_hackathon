import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";
import { connectDB } from "./config/connectDB.js";
import errorHandler from "./middlewares/errorHandling.js";
import path from "path";
import cookieParser from "cookie-parser";
import assetRoutes from "./routes/assetRoute.js";
import dashboardRoute from "./routes/dashboardRoute.js";
import assetManagerDashboardRoutes from "./routes/assetManagerDashRoute.js";

//routes
import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import adminRoutes from "./routes/adminRoute.js";
import profileRoute from "./routes/profileRoute.js";

// Fix MongoDB Atlas DNS issue (optional)
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// ==========================================
// Load Environment Variables
// ==========================================
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/public", express.static(path.join(process.cwd(), "public")));

// Parse JSON
app.use(express.json());

// Parse Form Data
app.use(express.urlencoded({ extended: true }));

// Parse Cookies
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("heelo");
});

// ==========================================
// routes
// ==========================================

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/user", profileRoute);
app.use("/api/asset-manager", assetManagerDashboardRoutes);

// ==========================================
// 404 Handler
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// ==========================================
// Global Error Handler
// ==========================================

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`🚀 app is listening on port : ${PORT}`);
    });

    server.on("error", (error) => {
      console.log("SERVER ERROR:", error);
    });
  } catch (error) {
    console.log("Server startup error:", error.message);

    process.exit(1);
  }
};

startServer();
