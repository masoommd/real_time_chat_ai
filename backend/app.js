import express from "express";
import morgan from "morgan"
import connectDB from "./db/db.js";
import userRoutes from "./routes/user_routes.js"
import projectRoutes from "./routes/project_routes.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import aiRoutes from "./routes/ai_routes.js";
import { sessionMiddleware } from "./middleware/session.js";

connectDB();

const corsOption = {
  origin: "http://localhost:5173",
  credentials: true
}
const app = express();
app.use(cors(corsOption));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())
app.use(sessionMiddleware);


app.use("/users",userRoutes);
app.use("/projects",projectRoutes);
app.use("/ai",aiRoutes )


app.get("/", (req,res) => {
    res.send("Hello World!");
})

export default app
