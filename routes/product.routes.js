import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { authRequired, adminRequired } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authRequired, adminRequired, createProduct); 
router.get("/", getProducts);
router.get("/:id", getProductById);
router.patch("/:id", authRequired, adminRequired, updateProduct);
router.delete("/:id", authRequired, adminRequired, deleteProduct);

export default router;
