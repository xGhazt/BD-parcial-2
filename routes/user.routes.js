import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  deleteUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/", createUser);       // Crear usuario
router.get("/", getUsers);          // Listar todos
router.get("/:id", getUserById);    // Buscar por ID
router.delete("/:id", deleteUser);  // Eliminar usuario

export default router;
