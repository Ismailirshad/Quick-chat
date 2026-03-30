import express from "express";
import authRoute from "./routes/authRoute.js";
import messageRoute from "./routes/messageRoute.js";
import path from "path";
import mongoose from "mongoose";
import { ENV } from "./lib/env.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";

const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;
const MONGODB_URI = ENV.MONGODB_URI;

app.use(express.json({ limit: "5mb" }));
app.use(
  cors({
    origin: ["http://localhost:5173", "https://quickchat.ismailirshad.in"],
    credentials: true,
  }),
);
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);

// For auto req to avoid server sleep in render deployment
app.get("/api/health", (req, res) => {
  res.send("OK");
});

// make ready for deployment
// if (ENV.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));

//   app.get("*", (_, res) => {
//     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
//   });
// }

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("Database connected");
  } catch (error) {
    console.log("Error connecting to Database", error);
  }
};

connectDB();

// for development
// server.listen(PORT, () => {
//   console.log("Server running on port", PORT);
// });

export default app;