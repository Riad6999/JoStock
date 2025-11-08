import Item from "../models/Item.js";

export const getItems = async (req, res) => {
  const items = await Item.find();
  res.json(items);
};

export const addItem = async (req, res) => {
  const item = new Item(req.body);
  await item.save();
  res.json(item);
};

export const updateItem = async (req, res) => {
  const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};
