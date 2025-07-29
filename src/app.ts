import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes";
import recipeRoutes from "./routes/recipes.routes";
import { setupSwagger } from "./swagger-config";

const app = express();

// Configuración CORS para desarrollo y producción
const allowedOrigins = [
  "http://localhost:4000",
  "http://127.0.0.1:4000",
  "https://api-recetas-0rb8.onrender.com",
  "http://api-recetas-0rb8.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir requests sin origin (como aplicaciones móviles o Postman)
      if (!origin) return callback(null, true);

      // Permitir orígenes específicos
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(
  helmet({
    contentSecurityPolicy: false, // Deshabilitar CSP para Swagger
    crossOriginEmbedderPolicy: false, // Permitir recursos cross-origin
  })
);

app.use(morgan("dev"));
app.use(express.json());

// Middleware adicional para headers CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin || "*");
  }
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Middleware para manejar preflight requests
app.options("*", (req, res) => {
  const origin = req.headers.origin;

  // Si el origen está en la lista permitida o es undefined (para herramientas como Swagger)
  if (!origin || allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin || "*");
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept, Origin"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

app.use("/auth", authRoutes);
app.use("/recipes", recipeRoutes);

setupSwagger(app);

export default app;
