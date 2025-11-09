import express from "express";
import { getItems, addItem, updateItem } from "../controllers/itemController.js";

const router = express.Router();
router.get("/", getItems);
router.post("/", addItem);
router.patch("/:id", updateItem);

export default router;
