import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: String,
  category: String,
  unit: String,
  stock: Number,
  lowLimit: Number,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Item", itemSchema);
