import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import dotenv from "dotenv";

dotenv.config();

// Configuración de Swagger
const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Recetas",
      version: "1.0.0",
      description:
        "Documentación de la API de recetas con Node, Express y TypeScript",
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "https://api-recetas-0rb8.onrender.com"
            : "http://localhost:4000",
        description:
          process.env.NODE_ENV === "production"
            ? "Servidor de Producción"
            : "Servidor de Desarrollo",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Ingrese el token JWT obtenido del login",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Archivos donde se documentan las rutas
};

// Generar documentación con Swagger
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Función para configurar Swagger en la aplicación
export const setupSwagger = (app: Express): void => {
  const swaggerUiOptions = {
    explorer: true,
    swaggerOptions: {
      docExpansion: "none",
      filter: true,
      showRequestHeaders: true,
      tryItOutEnabled: true,
      supportedSubmitMethods: ["get", "post", "put", "delete", "patch"],
      requestInterceptor: (req: any) => {
        req.headers["Content-Type"] = "application/json";
        return req;
      },
    },
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "API de Recetas - Documentación",
  };

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, swaggerUiOptions)
  );

  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://api-recetas-0rb8.onrender.com"
      : "http://localhost:4000";

  console.log(`📄 Swagger Docs disponible en ${baseUrl}/api-docs`);
};
