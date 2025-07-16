import express from "express";
import { register, login, refreshToken } from "../controllers/auth.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Endpoints de autenticación (Registro, Login, Refresh Token)
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Autenticación]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: usuario123
 *               password:
 *                 type: string
 *                 example: MiContraseñaSegura123
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error en la solicitud (datos inválidos)
 *       500:
 *         description: Error del servidor
 */
router.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión y obtener tokens
 *     tags: [Autenticación]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: usuario123
 *               password:
 *                 type: string
 *                 example: MiContraseñaSegura123
 *     responses:
 *       200:
 *         description: Login exitoso, retorna tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Usuario o contraseña incorrectos
 *       500:
 *         description: Error del servidor
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Generar un nuevo access token con el refresh token
 *     tags: [Autenticación]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR..."
 *     responses:
 *       200:
 *         description: Nuevo token generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Refresh token inválido o expirado
 *       500:
 *         description: Error del servidor
 */
router.post("/refresh-token", refreshToken);

export default router;
