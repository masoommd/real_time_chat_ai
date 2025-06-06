import express from "express";
import morgan from "morgan"
import connectDB from "./db/db.js";
import userRoutes from "./routes/user_routes.js"
import projectRoutes from "./routes/project_routes.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import aiRoutes from "./routes/ai_routes.js";


connectDB();


const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())


app.use("/users",userRoutes);
app.use("/projects",projectRoutes);
app.use("/ai",aiRoutes )


app.get("/", (req,res) => {
    res.send("Hello World!");
})

export default app
