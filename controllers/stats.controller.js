// controllers/stats.controller.js
import Order from "../models/order.model.js";
import Review from "../models/review.model.js";
import Category from "../models/category.model.js";
import Product from "../models/product.model.js";
import { createError } from "../utils/errorHandler.js";

//Ventas totales por categoría
 
export const ventasPorCategoria = async (req, res, next) => {
  try {
    const resultados = await Order.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.producto",
          foreignField: "_id",
          as: "producto",
        },
      },
      { $unwind: "$producto" },
      {
        $lookup: {
          from: "categories",
          localField: "producto.categoria",
          foreignField: "_id",
          as: "categoria",
        },
      },
      { $unwind: "$categoria" },
      {
        $group: {
          _id: "$categoria.nombre",
          totalVendidos: { $sum: "$items.cantidad" },
          ingresosTotales: { $sum: "$items.subtotal" },
        },
      },
      { $sort: { ingresosTotales: -1 } },
    ]);

    res.json({ success: true, data: resultados });
  } catch (err) {
    next(createError(500, "Error en agregación ventasPorCategoria"));
  }
};
//Cantidad de órdenes por estado
export const ordenesPorEstado = async (req, res, next) => {
  try {
    const resultados = await Order.aggregate([
      {
        $group: {
          _id: "$estado",
          cantidad: { $sum: 1 },
        },
      },
      { $sort: { cantidad: -1 } },
    ]);

    res.json({ success: true, data: resultados });
  } catch (err) {
    next(createError(500, "Error en agregación ordenesPorEstado"));
  }
};

//Promedio de calificaciones por producto
export const promedioCalificaciones = async (req, res, next) => {
  try {
    const resultados = await Review.aggregate([
      {
        $group: {
          _id: "$producto",
          promedio: { $avg: "$calificacion" },
          totalReseñas: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "producto",
        },
      },
      { $unwind: "$producto" },
      {
        $project: {
          _id: 0,
          producto: "$producto.nombre",
          promedio: { $round: ["$promedio", 2] },
          totalReseñas: 1,
        },
      },
      { $sort: { promedio: -1 } },
    ]);

    res.json({ success: true, data: resultados });
  } catch (err) {
    next(createError(500, "Error en agregación promedioCalificaciones"));
  }
};
