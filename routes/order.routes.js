// routes/order.routes.js
import express from "express";
import { authRequired, adminRequired } from "../middlewares/auth.middleware.js";
import { createOrder, getOrdersByUser, getOrders, updateOrderStatus } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", authRequired, createOrder);            
router.get("/my", authRequired, getOrdersByUser);       
router.get("/", authRequired, adminRequired, getOrders);
router.patch("/:id/status", authRequired, adminRequired, updateOrderStatus);

export default router;
