import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes";
import recipeRoutes from "./routes/recipes.routes";
import { setupSwagger } from "./swagger-config";

const app = express();

// Configuración CORS más específica
app.use(
  cors({
    origin: ["http://localhost:4000", "http://127.0.0.1:4000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(
  helmet({
    contentSecurityPolicy: false, // Deshabilitar CSP para Swagger
  })
);
app.use(morgan("dev"));
app.use(express.json());

// Middleware para manejar preflight requests
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.sendStatus(200);
});

app.use("/auth", authRoutes);
app.use("/recipes", recipeRoutes);

setupSwagger(app);

export default app;
