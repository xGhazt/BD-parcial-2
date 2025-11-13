import express from "express";
import { authRequired } from "../middlewares/auth.middleware.js";
import { addItem, getCart, updateItemQty, removeItem, getCartTotal } from "../controllers/cart.controller.js";

const router = express.Router();

router.use(authRequired); // todas las rutas requieren auth

router.get("/", getCart); 
router.get("/total", getCartTotal); 

router.post("/item", addItem); 
router.patch("/item", updateItemQty);
router.delete("/item", removeItem); 

export default router;
