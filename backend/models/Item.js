import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  unit: String,
  stock: { type: Number, default: 0 },
  lowLimit: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Item", itemSchema);
