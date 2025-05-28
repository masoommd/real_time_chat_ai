import "dotenv/config";
import http from "http";
import app from "./app.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Project from "./models/project_models.js";
import { generateResult } from "./services/ai_service.js";
import { sessionMiddleware } from "./middleware/session.js";

const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.engine.use((req, res, next) => {
  sessionMiddleware(req, {}, next);
});

io.use(async (socket, next) => {
  try {

    const { session } = socket.request;

    if (!session?.user) {
      return next(new Error("Unauthenticated"));  // no login → no WS
    }
    socket.user = session.user;   

    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(" ")[1];

    const projectId = socket.handshake.query.projectId;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new Error("Invalid projectId"));
    }

    socket.project = await Project.findById(projectId);

    if (!token) {
      return next(new Error("Authentication error"));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return next(new Error("Authentication error"));
    }
    // socket.user = decoded;

    next();
  } catch (err) {
    next(err);
  }
});

io.on("connection", (socket) => {
  socket.roomId = socket.project._id.toString();

  console.log("A user connected");

  socket.join(socket.roomId);

  socket.on("project-message", async (data) => {
    const message = data.message;

    const aiIsPresentInMessage = message.includes("@ai");

    socket.broadcast.to(socket.roomId).emit("project-message", data);

    if(aiIsPresentInMessage) {
        const prompt = message.replace("@ai", "").trim();
        
        const result = await generateResult(prompt);

        io.to(socket.roomId).emit("project-message", {
            message: result,
            sender :{
                _id:'ai',
                email:'AI'
            }
        });
     
       return;
    }


    
  });

  socket.on("event", (data) => {
    /* _ */
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
    socket.leave(socket.roomId);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}`);
});
