import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => {
  console.error("❌ Redis Error:", err.message);
});

redisClient.on("connect", () => {
  console.log("✅ Redis Connected");
});

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error("❌ Failed to connect Redis:", err.message);
  }
})();

export default redisClient;
