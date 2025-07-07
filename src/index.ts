import dotenv from "dotenv";
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { loggingMiddleware } from "./middleware/logging.middleware";
import routes from "./routes";

dotenv.config();

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || "3000", 10);

// Middleware
app.use(helmet()); // Sécurité
app.use(cors()); // Gestion des CORS
app.use(loggingMiddleware); // Logging personnalisé avec Supabase
app.use(express.json()); // Parser JSON

// Routes
app.use("/api", routes);

// Route de test
app.get("/health", (req: Request, res: Response) => {
  return res.json({ status: "OK", message: "Service is running" });
});

// Gestion des erreurs
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  return res.status(500).json({ error: "Something went wrong!" });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
