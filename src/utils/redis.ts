import { createClient } from "redis";
import log from "./logger";

export const redisClient = createClient({
    url: "redis://localhost:6379"
});

redisClient.on("error", (err) => {
    console.error("Redis error:", err);
});

export const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
        log.success(`Redis connected successfully`);

    }
};