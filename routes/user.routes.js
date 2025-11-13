import express from "express";
import {
  createUser,
  login,
  getUsers,
  getUserById,
  deleteUser,
} from "../controllers/user.controller.js";
import { authRequired, adminRequired } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", createUser);         
router.post("/login", login);         
router.get("/", authRequired, adminRequired, getUsers);
router.get("/:id", authRequired, getUserById);
router.delete("/:id", authRequired, adminRequired, deleteUser);

export default router;
