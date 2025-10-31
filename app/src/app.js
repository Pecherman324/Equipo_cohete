// Importaciones necesarias para Express y manejo de rutas estáticas
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateGreeting } from "./lib/greet.js";

/**
 * Crea y configura la aplicación Express
 * @returns {express.Application} Instancia de Express configurada
 */
export function createApp() {
  const app = express();
  
  // Obtener el directorio actual (compatible con ES modules)
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const publicDir = path.resolve(__dirname, "../public");

  // Servir archivos estáticos (HTML, CSS, JS) desde el directorio public
  app.use(express.static(publicDir));

  // Endpoint de salud - usado para verificar que el servicio está activo
  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Endpoint de API que genera un saludo personalizado
  app.get("/api/greeting", (_req, res) => {
    res.json({ message: generateGreeting("Mundo") });
  });

  return app;
}


