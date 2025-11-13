// controllers/order.controller.js
import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import { createError } from "../utils/errorHandler.js";

//Crear orden desde el carrito del usuario
export const createOrder = async (req, res, next) => {
  try {
    const usuarioId = req.user.id;
    const { metodoPago = "efectivo" } = req.body;

    const cart = await Cart.findOne({ usuario: usuarioId }).populate("items.producto", "precio stock nombre");
    if (!cart || cart.items.length === 0) return next(createError(400, "Carrito vacío"));

    // Validar stock y calcular total
    let total = 0;
    for (const it of cart.items) {
      const prod = await Product.findById(it.producto._id);
      if (!prod) return next(createError(404, `Producto ${it.producto._id} no encontrado`));
      if (prod.stock < it.cantidad) return next(createError(400, `Stock insuficiente para ${prod.nombre}`));
      total += it.subtotal;
    }

    // Crear Order
    const orden = new Order({
      usuario: usuarioId,
      items: cart.items.map((it) => ({ producto: it.producto._id, cantidad: it.cantidad, subtotal: it.subtotal })),
      total,
      estado: "pendiente",
      metodoPago,
    });
    await orden.save();

    // Reducir stock de productos (simple: iterar y restar)
    for (const it of cart.items) {
      await Product.findByIdAndUpdate(it.producto._id, { $inc: { stock: -it.cantidad } });
    }

    // Vaciar carrito del usuario
    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, data: orden });
  } catch (err) {
    next(createError(500, "Error al crear orden: " + err.message));
  }
};


export const getOrdersByUser = async (req, res, next) => {
  try {
    const usuarioId = req.user.id;
    const órdenes = await Order.find({ usuario: usuarioId }).populate("items.producto", "nombre precio");
    res.json({ success: true, data: órdenes });
  } catch (err) {
    next(createError(500, "Error al obtener órdenes"));
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const órdenes = await Order.find().populate("usuario", "nombre email").populate("items.producto", "nombre precio");
    res.json({ success: true, data: órdenes });
  } catch (err) {
    next(createError(500, "Error al obtener órdenes"));
  }
};


export const updateOrderStatus = async (req, res, next) => {
  try {
    const actualizado = await Order.findByIdAndUpdate(req.params.id, { estado: req.body.estado }, { new: true });
    if (!actualizado) return next(createError(404, "Orden no encontrada"));
    res.json({ success: true, data: actualizado });
  } catch (err) {
    next(createError(500, "Error al actualizar orden"));
  }
};
