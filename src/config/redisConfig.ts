// import Redis from "ioredis";
// import serverConfig from "./serverConfig";

// const redisConfig = {
//     port: serverConfig.REDIS_PORT,
//     host: serverConfig.REDIS_HOST,
//     maxRetriesPerRequest: null
// };

// const redisConnection = new Redis(redisConfig);

// export default redisConnection;

// src/config/redisConfig.ts
import Redis from "ioredis";

// Get the full Redis connection URL from the environment variables.
const redisUrl = process.env.REDIS_URL;

// It's good practice to ensure the URL is actually present before trying to connect.
if (!redisUrl) {
    throw new Error("FATAL: REDIS_URL is not defined in the environment variables.");
}

// ioredis can parse the full connection URL directly. This is the standard
// way to connect to hosted Redis instances like those on Upstash or Render.
const redisConnection = new Redis(redisUrl);

export default redisConnection;