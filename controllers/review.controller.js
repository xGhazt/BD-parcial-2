// controllers/review.controller.js
import mongoose from "mongoose";
import Review from "../models/review.model.js";
import Order from "../models/order.model.js";
import { createError } from "../utils/errorHandler.js";

/**
 * Crear reseña: solo si el usuario compró el producto
 * body: { producto, calificacion, comentario }
 */
export const createReview = async (req, res, next) => {
  try {
    const usuarioId = req.user.id;
    const { producto, calificacion, comentario } = req.body;

    // validaciones iniciales
    if (!producto || !calificacion) {
      return next(createError(400, "producto y calificacion requeridos"));
    }

    // validar formato del ObjectId
    if (!mongoose.isValidObjectId(producto)) {
      return next(createError(400, "ID de producto inválido"));
    }
    if (!mongoose.isValidObjectId(usuarioId)) {
      return next(createError(400, "ID de usuario inválido"));
    }

    // Buscar si el usuario tiene alguna orden que contenga ese producto.
    
    const comprado = await Order.findOne({
      usuario: usuarioId,
      items: { $elemMatch: { producto: producto } },
    }).lean();

    if (!comprado) {
      console.warn(`Usuario ${usuarioId} no posee orden con producto ${producto}`);
      return next(createError(403, "Solo puede opinar si compró el producto"));
    }

    // Evitar reseña duplicada del mismo usuario sobre mismo producto
    const existe = await Review.findOne({ usuario: usuarioId, producto: producto });
    if (existe) return next(createError(400, "Ya dejaste una reseña para este producto"));

    // Crear reseña
    const review = new Review({
      usuario: usuarioId,
      producto: producto,
      calificacion,
      comentario,
    });

    await review.save();

    return res.status(201).json({ success: true, data: review });
  } catch (err) {
    // logear error real en consola para depurar (útil)
    console.error("createReview error:", err);
    return next(createError(500, "Error interno al crear reseña: " + (err.message || "")));
  }
};


export const getReviewsByProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    if (!mongoose.isValidObjectId(productId)) return next(createError(400, "ID de producto inválido"));

    const reviews = await Review.find({ producto: productId }).populate("usuario", "nombre");
    res.json({ success: true, data: reviews });
  } catch (err) {
    console.error("getReviewsByProduct error:", err);
    next(createError(500, "Error al obtener reseñas"));
  }
};
