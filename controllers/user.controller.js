import User from "../models/user.model.js";
import { createError } from "../utils/errorHandler.js";

// Crear usuario (registro simple, sin JWT por ahora)
export const createUser = async (req, res, next) => {
  try {
    const nuevoUsuario = new User(req.body);
    await nuevoUsuario.save();
    res.status(201).json({ success: true, data: nuevoUsuario });
  } catch (err) {
    next(createError(400, err.message));
  }
};

// Obtener todos los usuarios
export const getUsers = async (req, res, next) => {
  try {
    const usuarios = await User.find();
    res.json({ success: true, data: usuarios });
  } catch (err) {
    next(createError(500, "Error al obtener usuarios"));
  }
};

// Obtener usuario por ID
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(createError(404, "Usuario no encontrado"));
    res.json({ success: true, data: user });
  } catch (err) {
    next(createError(400, "ID inválido"));
  }
};

// Eliminar usuario
export const deleteUser = async (req, res, next) => {
  try {
    const eliminado = await User.findByIdAndDelete(req.params.id);
    if (!eliminado) return next(createError(404, "Usuario no encontrado"));
    res.json({ success: true, message: "Usuario eliminado correctamente" });
  } catch (err) {
    next(createError(400, "Error al eliminar usuario"));
  }
};
