import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes";
import recipeRoutes from "./routes/recipes.routes";
import { setupSwagger } from "./swagger-config";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/recipes", recipeRoutes);

setupSwagger(app);

export default app;
