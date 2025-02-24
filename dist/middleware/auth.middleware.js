"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const authenticate = (req, res, next) => {
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
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next(); // ✅ Esencial para continuar con la ejecución de la ruta
    }
    catch (error) {
        res.status(401).json({ message: "Token inválido o expirado." });
    }
};
exports.authenticate = authenticate;
