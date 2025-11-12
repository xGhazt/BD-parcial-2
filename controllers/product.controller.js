import Product from "../models/product.model.js";
import { createError } from "../utils/errorHandler.js";

// Crear producto
export const createProduct = async (req, res, next) => {
  try {
    const nuevoProd = new Product(req.body);
    await nuevoProd.save();
    res.status(201).json({ success: true, data: nuevoProd });
  } catch (err) {
    next(createError(400, err.message));
  }
};

// Obtener todos los productos (con categoría)
export const getProducts = async (req, res, next) => {
  try {
    const productos = await Product.find().populate("categoria", "nombre");
    res.json({ success: true, data: productos });
  } catch (err) {
    next(createError(500, "Error al obtener productos"));
  }
};

// Obtener producto por ID
export const getProductById = async (req, res, next) => {
  try {
    const prod = await Product.findById(req.params.id).populate("categoria", "nombre");
    if (!prod) return next(createError(404, "Producto no encontrado"));
    res.json({ success: true, data: prod });
  } catch (err) {
    next(createError(400, "ID inválido"));
  }
};

// Actualizar producto
export const updateProduct = async (req, res, next) => {
  try {
    const actualizado = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizado) return next(createError(404, "Producto no encontrado"));
    res.json({ success: true, data: actualizado });
  } catch (err) {
    next(createError(400, "Error al actualizar producto"));
  }
};

// Eliminar producto
export const deleteProduct = async (req, res, next) => {
  try {
    const eliminado = await Product.findByIdAndDelete(req.params.id);
    if (!eliminado) return next(createError(404, "Producto no encontrado"));
    res.json({ success: true, message: "Producto eliminado correctamente" });
  } catch (err) {
    next(createError(400, "Error al eliminar producto"));
  }
};
