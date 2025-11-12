import express from "express";
import * as cartCtrl from "../controllers/cart.controller.js";

const router = express.Router();

// TODO: proteger con auth middleware cuando esté implementado
router.get("/:userId", cartCtrl.getCart);
router.post("/:userId", cartCtrl.addItem);

export default router;
