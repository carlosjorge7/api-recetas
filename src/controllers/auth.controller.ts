import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../model/db"; // Asegúrate de que la ruta es correcta

/**
 * Registro de usuario
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
      [username, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error en el registro" });
  }
};

/**
 * Inicio de sesión
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (user.rows.length === 0) {
      res.status(401).json({ message: "Usuario no encontrado" });
      return;
    }

    const isValid = await bcrypt.compare(password, user.rows[0].password);
    if (!isValid) {
      res.status(401).json({ message: "Credenciales incorrectas" });
      return;
    }

    // Crear Access Token
    const token = jwt.sign(
      { userId: user.rows[0].id },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    // Crear Refresh Token
    const refreshToken = jwt.sign(
      { userId: user.rows[0].id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" }
    );

    // Enviar los tokens en la respuesta
    res.json({ token, refreshToken });
  } catch (error) {
    res.status(500).json({ message: "Error en el login" });
  }
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ message: "No se proporcionó el refresh token" });
    return;
  }

  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as { userId: number };

    const newAccessToken = jwt.sign(
      { userId: payload.userId },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    res.json({ token: newAccessToken });
  } catch (error) {
    console.error("Error al verificar el refresh token:", error);
    res.status(401).json({ message: "Refresh token inválido o expirado" });
  }
};
