import { createClient, RedisClientType } from "redis";
import { env } from "./ENV";

let redisClient: RedisClientType;

const initRedisClient = () => {
  if (!redisClient) {
    redisClient = createClient({
      url: `redis://127.0.0.1:${env.REDIS_PORT}`,
    });

    redisClient.on("connect", () => {
      console.log("Redis client connected");
    });

    redisClient.on("error", (err: Error) => {
      console.error(err);
    });

    redisClient.connect().catch((err) => {
      console.error("Error connecting to redis:", err);
    });
  }

  return redisClient;
};

export { redisClient, initRedisClient };
