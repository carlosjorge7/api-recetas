import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Definir una interfaz extendida de Request para incluir userId
interface AuthRequest extends Request {
  userId?: number;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      res
        .status(401)
        .json({ message: "Acceso denegado. No se proporcionó un token." });
      return;
    }

    const token = authHeader.split(" ")[1]; // Esperamos "Bearer <token>"
    if (!token) {
      res.status(401).json({ message: "Formato de token inválido." });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };
    req.userId = decoded.userId;
    next(); // ✅ Esencial para continuar con la ejecución de la ruta
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado." });
  }
};
