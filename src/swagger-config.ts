import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

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
        url: "http://localhost:4000", // Cambia esto en producción
        description: "Servidor Local",
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Archivos donde se documentan las rutas
};

// Generar documentación con Swagger
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Función para configurar Swagger en la aplicación
export const setupSwagger = (app: Express): void => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📄 Swagger Docs disponible en http://localhost:4000/api-docs");
};
