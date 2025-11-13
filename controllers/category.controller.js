import Category from "../models/category.model.js";
import { createError } from "../utils/errorHandler.js";

// Crear categoría
 
export const createCategory = async (req, res, next) => {
  try {
    const nuevaCat = new Category(req.body);
    await nuevaCat.save();
    res.status(201).json({ success: true, data: nuevaCat });
  } catch (err) {
    next(createError(400, "Error al crear categoría: " + err.message));
  }
};

// Obtener todas las categorías
 
export const getCategories = async (req, res, next) => {
  try {
    const categorias = await Category.find().sort({ createdAt: -1 });
    res.json({ success: true, data: categorias });
  } catch (err) {
    next(createError(500, "Error al obtener categorías"));
  }
};


//Obtener categoría por ID

export const getCategoryById = async (req, res, next) => {
  try {
    const categoria = await Category.findById(req.params.id);
    if (!categoria) return next(createError(404, "Categoría no encontrada"));
    res.json({ success: true, data: categoria });
  } catch (err) {
    next(createError(400, "Error al obtener categoría"));
  }
};

//Actualizar categoría
 
export const updateCategory = async (req, res, next) => {
  try {
    const actualizada = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!actualizada) return next(createError(404, "Categoría no encontrada"));
    res.json({ success: true, data: actualizada });
  } catch (err) {
    next(createError(400, "Error al actualizar categoría"));
  }
};

//Eliminar categoría

export const deleteCategory = async (req, res, next) => {
  try {
    const eliminada = await Category.findByIdAndDelete(req.params.id);
    if (!eliminada) return next(createError(404, "Categoría no encontrada"));
    res.json({ success: true, message: "Categoría eliminada correctamente" });
  } catch (err) {
    next(createError(400, "Error al eliminar categoría"));
  }
};
