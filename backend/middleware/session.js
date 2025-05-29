// middleware/session.js
import session from "express-session";
import { RedisStore } from "connect-redis";      // ← v7 named export
import redisClient from "../services/redis_service.js";

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "sess:",
});

export const sessionMiddleware = session({
  store: redisStore,
  secret: process.env.SESSION_SECRET || "super-secret-session-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,             //  true only behind HTTPS
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
});
