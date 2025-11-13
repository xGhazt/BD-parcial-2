import express from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { authRequired, adminRequired } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post("/", authRequired, adminRequired, createCategory);
router.get("/", getCategories);
router.patch("/:id", authRequired, adminRequired, updateCategory);
router.delete("/:id", authRequired, adminRequired, deleteCategory);

export default router;
