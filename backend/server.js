// backend/server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import itemRoutes from "./routes/itemRoutes.js";

dotenv.config();
const app = express();

// ✅ Middleware setup
app.use(cors({
  origin: "*", // allow all origins (Vercel frontend included)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json()); // Parse JSON request bodies

// ✅ API routes
app.use("/api/items", itemRoutes);

// ✅ Root route (for quick check)
app.get("/", (req, res) => {
  res.send("JoStock API Running ✅");
});

// ✅ MongoDB connect
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  });

// ✅ Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
