import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/**
 * Middleware placeholder para autenticación JWT.
 * TODO: completar validación real (verificar token, cargar usuario en req.user)
 */
export const authRequired = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export const adminRequired = (req, res, next) => {
  // TODO: verificar req.user.role === "admin"
  if (req.user && req.user.role === "admin") return next();
  return res.status(403).json({ error: "Admin role required" });
};
