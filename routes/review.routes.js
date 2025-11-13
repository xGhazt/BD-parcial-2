// routes/review.routes.js
import express from "express";
import { authRequired } from "../middlewares/auth.middleware.js";
import { createReview, getReviewsByProduct } from "../controllers/review.controller.js";

const router = express.Router();

router.post("/", authRequired, createReview); 
router.get("/product/:productId", getReviewsByProduct);

export default router;
