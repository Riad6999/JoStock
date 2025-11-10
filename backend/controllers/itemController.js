import Item from "../models/Item.js";

export const getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    console.error("❌ Error fetching items:", err.message);
    res.status(500).json({ message: "Error fetching items" });
  }
};

export const addItem = async (req, res) => {
  try {
    const { name, category, unit, stock, lowLimit } = req.body;

    if (!name) return res.status(400).json({ message: "Name is required" });

    const item = new Item({
      name,
      category: category || "",
      unit: unit || "",
      stock: stock || 0,
      lowLimit: lowLimit || 0,
    });

    const saved = await item.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Error adding item:", err.message);
    res.status(500).json({ message: "Error adding item" });
  }
};
