import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
  type: String, // 'add' or 'use'
  qty: Number,
  note: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Log", logSchema);
