// routes/stats.routes.js
import express from "express";
import {
  ventasPorCategoria,
  ordenesPorEstado,
  promedioCalificaciones,
} from "../controllers/stats.controller.js";
import {authRequired ,adminRequired } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.get("/ventas-categoria", authRequired ,adminRequired, ventasPorCategoria);
router.get("/ordenes-estado", authRequired ,adminRequired, ordenesPorEstado);
router.get("/promedio-calificaciones", authRequired,adminRequired, promedioCalificaciones);

export default router;
