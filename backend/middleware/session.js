import session from "express-session";
import connectRedis from "connect-redis";
import { createClient } from "redis";

const RedisStore = connectRedis(session);

const redisClient = createClient({ legacyMode: true });
redisClient.connect().catch(console.error);

export const sessionMiddleware = session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // Set true in production with HTTPS
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: "lax"
  }
});
