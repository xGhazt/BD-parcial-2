// controllers/user.controller.js
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createError } from "../utils/errorHandler.js";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "8h";

// Crear usuario (registro)
export const createUser = async (req, res, next) => {
  try {
    const nuevoUsuario = new User(req.body);
    await nuevoUsuario.save();

    const userObj = nuevoUsuario.toObject();
    delete userObj.password; // no devolver password

    res.status(201).json({ success: true, data: userObj });
  } catch (err) {
    // Manejo simple de duplicados de email
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return next(createError(400, "Email ya registrado"));
    }
    next(createError(400, err.message));
  }
};

// Login -> retorna token JWT
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return next(createError(400, "Email y password requeridos"));

    const user = await User.findOne({ email });
    if (!user) return next(createError(401, "Credenciales inválidas"));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(createError(401, "Credenciales inválidas"));

    const payload = { userId: user._id.toString(), role: user.rol };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    const userObj = user.toObject();
    delete userObj.password;

    res.json({ success: true, token, user: userObj });
  } catch (err) {
    next(createError(500, "Error en login"));
  }
};

// Obtener todos los usuarios (ejemplo: podrías proteger esto con adminRequired)
export const getUsers = async (req, res, next) => {
  try {
    const usuarios = await User.find().select("-password");
    res.json({ success: true, data: usuarios });
  } catch (err) {
    next(createError(500, "Error al obtener usuarios"));
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return next(createError(404, "Usuario no encontrado"));
    res.json({ success: true, data: user });
  } catch (err) {
    next(createError(400, "ID inválido"));
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const eliminado = await User.findByIdAndDelete(req.params.id);
    if (!eliminado) return next(createError(404, "Usuario no encontrado"));
    res.json({ success: true, message: "Usuario eliminado correctamente" });
  } catch (err) {
    next(createError(400, "Error al eliminar usuario"));
  }
};
