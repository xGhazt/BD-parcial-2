import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const authRequired = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Token no provisto" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    req.user = { id: decoded.userId, role: decoded.role };
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, error: "Token inválido o expirado" });
  }
};

export const adminRequired = (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, error: "No autenticado" });
  if (req.user.role !== "admin") return res.status(403).json({ success: false, error: "Admin role required" });
  return next();
};
