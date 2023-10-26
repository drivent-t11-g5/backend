import { createClient } from "redis";

export const DEFAULT_EXP = 300; // 5 min

const redis = createClient({
    url: process.env.REDIS_URL
});

(async () => {
    console.log("connecting to redis...");
    await redis.connect();
})();

export default redis;
