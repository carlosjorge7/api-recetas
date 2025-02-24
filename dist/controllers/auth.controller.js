"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../model/db")); // Asegúrate de que la ruta es correcta
/**
 * Registro de usuario
 */
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const result = yield db_1.default.query("INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username", [username, hashedPassword]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ message: "Error en el registro" });
    }
});
exports.register = register;
/**
 * Inicio de sesión
 */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield db_1.default.query("SELECT * FROM users WHERE username = $1", [
            username,
        ]);
        if (user.rows.length === 0) {
            res.status(401).json({ message: "Usuario no encontrado" });
            return;
        }
        const isValid = yield bcryptjs_1.default.compare(password, user.rows[0].password);
        if (!isValid) {
            res.status(401).json({ message: "Credenciales incorrectas" });
            return;
        }
        // Crear Access Token
        const token = jsonwebtoken_1.default.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        // Crear Refresh Token
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user.rows[0].id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
        // Enviar los tokens en la respuesta
        res.json({ token, refreshToken });
    }
    catch (error) {
        res.status(500).json({ message: "Error en el login" });
    }
});
exports.login = login;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(400).json({ message: "No se proporcionó el refresh token" });
        return;
    }
    try {
        const payload = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const newAccessToken = jsonwebtoken_1.default.sign({ userId: payload.userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token: newAccessToken });
    }
    catch (error) {
        console.error("Error al verificar el refresh token:", error);
        res.status(401).json({ message: "Refresh token inválido o expirado" });
    }
});
exports.refreshToken = refreshToken;
