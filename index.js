import express from "express";
import mongoose from "mongoose";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";

import routes from "./routes/index.js";
import { setupSocket } from "./sockets/socketHandler.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }, // Adjust in production accordingly

});
app.use(express.json());
app.use((req, res, next) => {
    req.app.set('io', io); // Make io available in req.app
    next();
});
app.use(express.static('public'));
app.use("/api/v1/", routes);

//MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.error(error));

  // setup socket.io

  setupSocket(io);

  const PORT=process.env.PORT|| 1234;
  server.listen(PORT,()=>console.log(`Server running on port ${PORT}`));