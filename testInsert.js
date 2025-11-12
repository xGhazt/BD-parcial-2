// testInsert.js
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";

// Modelos
import User from "./models/user.model.js";
import Category from "./models/category.model.js";
import Product from "./models/product.model.js";
import Cart from "./models/cart.model.js";
import Order from "./models/order.model.js";
import Review from "./models/review.model.js";

connectDB()
  .then(async () => {
    console.log("🧪 Iniciando inserciones de prueba...");

    // 1️⃣ Crear usuario
    const usuario = new User({
      nombre: "María",
      email: "maria@mail.com",
      password: "654321",
      rol: "user",
      direccion: "Calle Falsa 123",
    });
    await usuario.save();
    console.log("✅ Usuario insertado");

    // 2️⃣ Crear categoría
    const categoria = new Category({
      nombre: "Electrónica",
      descripcion: "Dispositivos tecnológicos",
    });
    await categoria.save();
    console.log("✅ Categoría insertada");

    // 3️⃣ Crear producto (relacionado con la categoría)
    const producto = new Product({
      nombre: "Auriculares",
      descripcion: "Bluetooth, cancelación de ruido",
      precio: 15000,
      stock: 20,
      categoria: categoria._id,
    });
    await producto.save();
    console.log("✅ Producto insertado");

    // 4️⃣ Crear carrito (relacionado con usuario y producto)
    const carrito = new Cart({
      usuario: usuario._id,
      items: [
        {
          producto: producto._id,
          cantidad: 2,
          subtotal: producto.precio * 2,
        },
      ],
    });
    await carrito.save();
    console.log("✅ Carrito insertado");

    // 5️⃣ Crear orden (a partir del carrito)
    const orden = new Order({
      usuario: usuario._id,
      items: carrito.items,
      total: carrito.items.reduce((acc, item) => acc + item.subtotal, 0),
      estado: "pendiente",
      metodoPago: "tarjeta",
    });
    await orden.save();
    console.log("✅ Orden insertada");

    // 6️⃣ Crear reseña (usuario sobre el producto)
    const resena = new Review({
      usuario: usuario._id,
      producto: producto._id,
      calificacion: 5,
      comentario: "Excelente calidad de sonido 🎧",
    });
    await resena.save();
    console.log("✅ Reseña insertada");

    console.log("🎉 Todas las inserciones se completaron correctamente.");
  })
  .catch((err) => {
    console.error("❌ Error durante el test:", err);
  })
  .finally(async () => {
    await mongoose.connection.close();
    console.log("🔒 Conexión cerrada.");
  });
