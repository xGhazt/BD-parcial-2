import express from "express";
import * as orderCtrl from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", orderCtrl.createOrder);

export default router;
