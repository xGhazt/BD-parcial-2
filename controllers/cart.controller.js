// controllers/cart.controller.js
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import { createError } from "../utils/errorHandler.js";

//Obtener carrito del usuario 
export const getCart = async (req, res, next) => {
  try {
    const usuarioId = req.user.id;
    let cart = await Cart.findOne({ usuario: usuarioId }).populate("items.producto", "nombre precio");
    if (!cart) {
      
      return res.json({ success: true, data: { usuario: usuarioId, items: [] } });
    }
    res.json({ success: true, data: cart });
  } catch (err) {
    next(createError(500, "Error al obtener carrito"));
  }
};
//Obtener total del carrito
export const getCartTotal = async (req, res, next) => {
  try {
    const usuarioId = req.user.id;
    const cart = await Cart.findOne({ usuario: usuarioId });
    if (!cart) return res.json({ success: true, data: { total: 0 } });
    const total = cart.items.reduce((acc, it) => acc + (it.subtotal || 0), 0);
    res.json({ success: true, data: { total } });
  } catch (err) {
    next(createError(500, "Error al calcular total del carrito"));
  }
};

//Añadir item al carrito 
export const addItem = async (req, res, next) => {
  try {
    const usuarioId = req.user.id;
    const { producto: productoId, cantidad = 1 } = req.body;

    const producto = await Product.findById(productoId);
    if (!producto) return next(createError(404, "Producto no encontrado"));

    
    const subtotal = producto.precio * cantidad;

    let cart = await Cart.findOne({ usuario: usuarioId });
    if (!cart) {
      cart = new Cart({ usuario: usuarioId, items: [{ producto: productoId, cantidad, subtotal }] });
    } else {
      const idx = cart.items.findIndex((it) => it.producto.toString() === productoId.toString());
      if (idx > -1) {
        
        cart.items[idx].cantidad += cantidad;
        cart.items[idx].subtotal = cart.items[idx].cantidad * producto.precio;
      } else {
        cart.items.push({ producto: productoId, cantidad, subtotal });
      }
    }
    await cart.save();
    await cart.populate("items.producto", "nombre precio");
    res.status(201).json({ success: true, data: cart });
  } catch (err) {
    next(createError(500, "Error al añadir producto al carrito"));
  }
};

//Actualizar cantidad de item
 
export const updateItemQty = async (req, res, next) => {
  try {
    const usuarioId = req.user.id;
    const { producto: productoId, cantidad } = req.body;
    if (!productoId || typeof cantidad !== "number") return next(createError(400, "Producto y cantidad requeridos"));

    const producto = await Product.findById(productoId);
    if (!producto) return next(createError(404, "Producto no encontrado"));

    const cart = await Cart.findOne({ usuario: usuarioId });
    if (!cart) return next(createError(404, "Carrito no encontrado"));

    const idx = cart.items.findIndex((it) => it.producto.toString() === productoId.toString());
    if (idx === -1) return next(createError(404, "Producto no está en el carrito"));

    cart.items[idx].cantidad = cantidad;
    cart.items[idx].subtotal = producto.precio * cantidad;

    
    if (cart.items[idx].cantidad <= 0) cart.items.splice(idx, 1);

    await cart.save();
    await cart.populate("items.producto", "nombre precio");
    res.json({ success: true, data: cart });
  } catch (err) {
    next(createError(500, "Error al actualizar cantidad"));
  }
};

//Eliminar item del carrito
export const removeItem = async (req, res, next) => {
  try {
    const usuarioId = req.user.id;
    const { producto: productoId } = req.body;
    if (!productoId) return next(createError(400, "producto requerido"));

    const cart = await Cart.findOne({ usuario: usuarioId });
    if (!cart) return next(createError(404, "Carrito no encontrado"));

    cart.items = cart.items.filter((it) => it.producto.toString() !== productoId.toString());
    await cart.save();
    await cart.populate("items.producto", "nombre precio");
    res.json({ success: true, data: cart });
  } catch (err) {
    next(createError(500, "Error al eliminar item"));
  }
};
