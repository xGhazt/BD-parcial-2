import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import reviewRoutes from "./routes/review.routes.js";

dotenv.config();
const app = express();

// Middleware base
app.use(express.json());

// Rutas base
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);

// Test
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente----");
});

// Error handler placeholder (se puede mejorar)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ success: false, error: err.message || "Server error" });
});

// Conectar a la base de datos
connectDB();

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SERVIDOR CORRIENDO EN EL PUERTO ${PORT}----`));
