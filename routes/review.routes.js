import express from "express";
import * as reviewCtrl from "../controllers/review.controller.js";

const router = express.Router();

router.post("/", reviewCtrl.createReview);

export default router;
